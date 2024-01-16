import { useEffect } from 'react';

const ConfirmClose = () => {
    useEffect(() => {
        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };

        const visibilityChangeCallback = () => {
            if (document.visibilityState === 'hidden') {
                document.addEventListener("unload", unloadCallback);
            } else {
                document.removeEventListener("unload", unloadCallback);
            }
        };

        window.addEventListener("beforeunload", unloadCallback);
        document.addEventListener("visibilitychange", visibilityChangeCallback);

        return () => {
            window.removeEventListener("beforeunload", unloadCallback);
            document.removeEventListener("visibilitychange", visibilityChangeCallback);
            document.removeEventListener("unload", unloadCallback);
        };
    }, []);

    return null;
};

export default ConfirmClose;
