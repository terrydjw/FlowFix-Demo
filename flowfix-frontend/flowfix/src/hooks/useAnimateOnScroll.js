import { useInView } from 'react-intersection-observer';

// This hook will contain all the logic from our old component
export const useAnimateOnScroll = (options = {}) => {
    const {
        // Default options can be overridden
        triggerOnce = true,
        threshold = 0.1,
    } = options;

    const { ref, inView } = useInView({ triggerOnce, threshold });

    // The hook returns the ref to attach and a boolean indicating if it's in view
    return [ref, inView];
};