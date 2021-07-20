import React from "react"

interface props {
    isActive?: boolean
    activeColor?: string
    inactiveColor?: string
    setIsActive?: any
    setNotActive?: any
    activeText?: string
    inactiveText?: string
}

const SwitchButton: React.FC<props> = ({
    isActive,
    activeColor,
    inactiveColor,
    setIsActive,
    setNotActive,
    activeText,
    inactiveText,
}) => {
    return (
        <div
            className="switch-slider"
            style={
                isActive
                    ? { backgroundColor: activeColor }
                    : { backgroundColor: inactiveColor }
            }
        >
            <button
                className="switch-btn"
                style={isActive ? { right: "0" } : { left: "0" }}
                onClick={() => {
                    if (isActive) {
                        setNotActive()
                    } else {
                        setIsActive()
                    }
                }}
            >
                <span className="icon-info">
                    {isActive ? activeText : inactiveText}
                </span>
                <span className="text-info-arrow" />
            </button>
        </div>
    )
}

export default SwitchButton
