import datetime
import os.path
import json
import pytz  # <-- NEW: Import pytz library

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# --- GET ABSOLUTE PATHS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(BASE_DIR, 'credentials.json')
TOKEN_PATH = os.path.join(BASE_DIR, 'token.json')

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar"]

# Load configuration from config.json
with open('config.json', 'r') as f:
    config = json.load(f)
BUSINESS_HOURS_START = datetime.time.fromisoformat(config['business_hours']['start'])
BUSINESS_HOURS_END = datetime.time.fromisoformat(config['business_hours']['end'])
EMERGENCY_BLOCK_SUMMARY = config['emergency_info']['block_event_summary']


def get_calendar_service():
    """
    Authenticates with the Google Calendar API and returns a service object.
    Handles the OAuth2 flow and stores/refreshes credentials.
    """
    creds = None
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_PATH, "w") as token:
            token.write(creds.to_json())

    try:
        service = build("calendar", "v3", credentials=creds)
        return service
    except HttpError as error:
        print(f"An error occurred: {error}")
        return None

def find_available_slots(start_date_str, duration_minutes=60):
    """
    Finds available 1-hour slots within business hours for a given day,
    using the Europe/London timezone consistently.
    """
    service = get_calendar_service()
    if not service:
        return ["Error connecting to calendar."]

    # --- START OF FIX ---
    # 1. Define the correct, non-changing timezone
    london_tz = pytz.timezone("Europe/London")

    # 2. Create a "naive" datetime object at midnight
    naive_day_start = datetime.datetime.fromisoformat(f"{start_date_str}T00:00:00")
    
    # 3. Make the datetime "aware" by localizing it to the London timezone
    day_start = london_tz.localize(naive_day_start)
    day_end = day_start + datetime.timedelta(days=1)
    # --- END OF FIX ---

    try:
        free_busy_response = (
            service.freebusy()
            .query(
                body={
                    # --- FIX: Use timezone-aware isoformat strings and specify London timezone
                    "timeMin": day_start.isoformat(),
                    "timeMax": day_end.isoformat(),
                    "timeZone": "Europe/London", 
                    "items": [{"id": "primary"}],
                }
            )
            .execute()
        )
    except HttpError as error:
        print(f"An error occurred checking free/busy times: {error}")
        return [f"Could not check calendar availability. Error: {error}"]

    busy_intervals = free_busy_response["calendars"]["primary"]["busy"]
    available_slots = []
    
    # --- FIX: Ensure potential slots are also created in the London timezone
    potential_slot_start = day_start.replace(
        hour=BUSINESS_HOURS_START.hour, 
        minute=BUSINESS_HOURS_START.minute, 
        second=0, 
        microsecond=0
    )
    
    business_day_end = day_start.replace(
        hour=BUSINESS_HOURS_END.hour, 
        minute=BUSINESS_HOURS_END.minute,
        second=0,
        microsecond=0
    )

    while potential_slot_start < business_day_end:
        potential_slot_end = potential_slot_start + datetime.timedelta(minutes=duration_minutes)
        
        if potential_slot_end > business_day_end:
            break

        is_free = True
        for busy_period in busy_intervals:
            # Google API returns timezone-aware ISO strings, fromisoformat handles them correctly
            busy_start = datetime.datetime.fromisoformat(busy_period["start"])
            busy_end = datetime.datetime.fromisoformat(busy_period["end"])
            
            # All comparisons are now between timezone-aware datetimes
            if potential_slot_start < busy_end and potential_slot_end > busy_start:
                is_free = False
                break
        
        if is_free:
            available_slots.append(potential_slot_start.isoformat())

        potential_slot_start += datetime.timedelta(minutes=30) 

    return available_slots

def create_appointment(summary, description, start_time_str, end_time_str, customer_name, customer_phone):
    """
    Creates a new event on the primary Google Calendar.
    """
    service = get_calendar_service()
    if not service:
        return "Error: Could not connect to Google Calendar."

    event = {
        "summary": summary,
        "description": f"{description}\nCustomer: {customer_name}\nPhone: {customer_phone}",
        "start": {
            "dateTime": start_time_str,
            "timeZone": "Europe/London"
        },
        "end": {
            "dateTime": end_time_str,
            "timeZone": "Europe/London"
        },
    }
    
    try:
        created_event = service.events().insert(calendarId="primary", body=event).execute()
        return f"Booking confirmed! I've added the appointment to the calendar for you. Event ID: {created_event.get('id')}"
    except HttpError as error:
        print(f"An error occurred creating the event: {error}")
        return "Sorry, I was unable to create the appointment. Please try again."

def check_for_emergency_blocks(hours_to_check=3):
    """
    Checks if there are any events with the emergency block summary in the next few hours.
    """
    service = get_calendar_service()
    if not service:
        return True

    now = datetime.datetime.utcnow()
    time_max = now + datetime.timedelta(hours=hours_to_check)

    try:
        events_result = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=now.isoformat() + "Z", # Use UTC for this check
                timeMax=time_max.isoformat() + "Z", # Use UTC for this check
                q=EMERGENCY_BLOCK_SUMMARY,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        events = events_result.get("items", [])
        return len(events) > 0
    
    except HttpError as error:
        print(f"An error occurred checking for emergency blocks: {error}")
        return True