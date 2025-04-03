import React, { createContext, useContext, useState } from "react";

const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
    const [mute, setMute] = useState(false);

    const toggleMute = () => {
        setMute((prev) => !prev);
    };

    return (
        <SoundContext.Provider value={{ mute, toggleMute }}>
            {children}
        </SoundContext.Provider>
    );
};

// Hook để sử dụng SoundContext dễ dàng
export const useSound = () => {
    return useContext(SoundContext);
};
