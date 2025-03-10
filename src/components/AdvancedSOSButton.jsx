"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { useAppContext } from "../context/AppContext"
import ConfirmationDialog from "./ConfirmationDialog"

function AdvancedSOSButton() {
    const { navigateTo } = useAppContext()
    const [isPressed, setIsPressed] = useState(false)
    const [pulseAnimation, setPulseAnimation] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)

    // Start pulse animation when component mounts
    useEffect(() => {
        setPulseAnimation(true)
    }, [])

    // Handle button click - restore original functionality
    const handleClick = () => {
        setShowConfirmation(true)
    }

    // Update the button handlers to properly handle mouse/touch events
    // Add mouseLeave handler to reset button state when cursor moves away

    const handlePressStart = () => {
        setIsPressed(true)
    }

    const handlePressEnd = () => {
        setIsPressed(false)
    }

    const handleMouseLeave = () => {
        // Reset pressed state when mouse leaves the button
        if (isPressed) {
            setIsPressed(false)
        }
    }

    const handleConfirm = () => {
        setShowConfirmation(false)
        navigateTo("sosForm")
    }

    const handleCancel = () => {
        setShowConfirmation(false)
    }

    return (
        <>
            {/* Main SOS button container - only keep the button itself */}
            <div className="relative flex flex-col items-center justify-center">
                {/* Outer glow ring */}
                <AnimatePresence>
                    {pulseAnimation && (
                        <motion.div
                            className="absolute rounded-full bg-transparent"
                            initial={{
                                width: "240px",
                                height: "240px",
                                opacity: 0.2,
                                borderWidth: "2px",
                                borderColor: "rgba(255, 0, 0, 0.3)",
                            }}
                            animate={{
                                width: ["240px", "280px"],
                                height: ["240px", "280px"],
                                opacity: [0.2, 0],
                                borderWidth: ["2px", "1px"],
                                borderColor: ["rgba(255, 0, 0, 0.3)", "rgba(255, 0, 0, 0)"],
                            }}
                            transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 2,
                                ease: "easeInOut",
                            }}
                            style={{ borderStyle: "solid" }}
                        />
                    )}
                </AnimatePresence>

                {/* Button base shadow */}
                <div className="absolute w-[220px] h-[220px] rounded-full bg-black shadow-[0_0_40px_rgba(255,0,0,0.2)]"></div>

                {/* Button base with metallic effect */}
                <motion.div
                    className="absolute w-[210px] h-[210px] rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900"
                    style={{
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 1px rgba(0,0,0,0.5)",
                    }}
                    animate={isPressed ? { scale: 0.97 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                ></motion.div>

                {/* Red ring */}
                <motion.div
                    className="absolute w-[200px] h-[200px] rounded-full"
                    style={{
                        background: "transparent",
                        border: "3px solid",
                        borderColor: "rgba(255,0,0,0.7)",
                        boxShadow: "0 0 10px rgba(255,0,0,0.5), inset 0 0 10px rgba(255,0,0,0.3)",
                    }}
                ></motion.div>

                {/* Button surface with glossy effect */}
                {/* Update the motion.button element to include onMouseLeave handler */}
                <motion.button
                    className="relative w-[180px] h-[180px] rounded-full bg-gradient-to-b from-zinc-800 via-zinc-900 to-black flex items-center justify-center focus:outline-none"
                    style={{
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.3)",
                    }}
                    onClick={handleClick}
                    onMouseDown={handlePressStart}
                    onMouseUp={handlePressEnd}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handlePressStart}
                    onTouchEnd={handlePressEnd}
                    onTouchCancel={handlePressEnd}
                    whileHover={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.4)" }}
                    animate={isPressed ? { scale: 0.95, y: 2 } : { scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    {/* SOS text or icon */}
                    <motion.div
                        className="text-red-500 font-bold text-4xl tracking-widest"
                        animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
                    >
                        <div className="flex flex-col items-center">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                            <span className="text-2xl mt-1">SOS</span>
                        </div>
                    </motion.div>

                    {/* Highlight overlay for glossy effect */}
                    <div className="absolute top-0 left-[50%] translate-x-[-50%] w-[140px] h-[90px] bg-gradient-to-b from-white to-transparent opacity-[0.07] rounded-t-full"></div>
                </motion.button>
            </div>

            {showConfirmation && (
                <ConfirmationDialog
                    title="Request Help"
                    message="Are you sure you want to send an SOS request?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    )
}

export default AdvancedSOSButton

