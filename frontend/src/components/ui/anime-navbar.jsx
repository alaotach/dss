import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function AnimeNavBar({ items, className, defaultActive, onTabChange, dropdownItems }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredTab, setHoveredTab] = useState(null)
  const [activeTab, setActiveTab] = useState(defaultActive)
  const [isMobile, setIsMobile] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleTabClick = (itemId) => {
    setActiveTab(itemId)
    if (onTabChange) {
      onTabChange(itemId)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex justify-center mb-6 relative z-[9999]">
      <motion.div 
        className={cn(
          "flex items-center gap-3 bg-surface/90 border border-border backdrop-blur-lg py-2 px-2 rounded-full shadow-lg relative z-[9999]",
          className
        )}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isHovered = hoveredTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300",
                "text-textSecondary hover:text-textPrimary",
                isActive && "text-textPrimary"
              )}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full -z-10 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.03, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-0 bg-accent/25 rounded-full blur-md" />
                  <div className="absolute inset-[-4px] bg-accent/20 rounded-full blur-xl" />
                  <div className="absolute inset-[-8px] bg-accent/15 rounded-full blur-2xl" />
                  <div className="absolute inset-[-12px] bg-accent/5 rounded-full blur-3xl" />
                  
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0"
                    style={{
                      animation: "shine 3s ease-in-out infinite"
                    }}
                  />
                </motion.div>
              )}

              <motion.span
                className="hidden md:inline relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
              <motion.span 
                className="md:hidden relative z-10"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {Icon && <Icon size={18} strokeWidth={2.5} />}
              </motion.span>
        
              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-accent/10 rounded-full -z-10"
                  />
                )}
              </AnimatePresence>

              {isActive && (
                <motion.div
                  layoutId="anime-mascot"
                  className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="relative w-12 h-12">
                    <motion.div 
                      className="absolute w-10 h-10 bg-textPrimary rounded-full left-1/2 -translate-x-1/2 shadow-lg"
                      animate={
                        hoveredTab ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, -5, 5, 0],
                          transition: {
                            duration: 0.5,
                            ease: "easeInOut"
                          }
                        } : {
                          y: [0, -3, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }
                      }
                    >
                      <motion.div 
                        className="absolute w-2 h-2 bg-bg rounded-full"
                        animate={
                          hoveredTab ? {
                            scaleY: [1, 0.2, 1],
                            transition: {
                              duration: 0.2,
                              times: [0, 0.5, 1]
                            }
                          } : {}
                        }
                        style={{ left: '25%', top: '40%' }}
                      />
                      <motion.div 
                        className="absolute w-2 h-2 bg-bg rounded-full"
                        animate={
                          hoveredTab ? {
                            scaleY: [1, 0.2, 1],
                            transition: {
                              duration: 0.2,
                              times: [0, 0.5, 1]
                            }
                          } : {}
                        }
                        style={{ right: '25%', top: '40%' }}
                      />
                      <motion.div 
                        className="absolute w-2 h-1.5 bg-accent/60 rounded-full"
                        animate={{
                          opacity: hoveredTab ? 0.8 : 0.6
                        }}
                        style={{ left: '15%', top: '55%' }}
                      />
                      <motion.div 
                        className="absolute w-2 h-1.5 bg-accent/60 rounded-full"
                        animate={{
                          opacity: hoveredTab ? 0.8 : 0.6
                        }}
                        style={{ right: '15%', top: '55%' }}
                      />
                      
                      <motion.div 
                        className="absolute w-4 h-2 border-b-2 border-bg rounded-full"
                        animate={
                          hoveredTab ? {
                            scaleY: 1.5,
                            y: -1
                          } : {
                            scaleY: 1,
                            y: 0
                          }
                        }
                        style={{ left: '30%', top: '60%' }}
                      />
                      <AnimatePresence>
                        {hoveredTab && (
                          <>
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              className="absolute -top-1 -right-1 w-2 h-2 text-accent"
                            >
                              ✨
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{ delay: 0.1 }}
                              className="absolute -top-2 left-0 w-2 h-2 text-accent"
                            >
                              ✨
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-4 h-4 -translate-x-1/2"
                      animate={
                        hoveredTab ? {
                          y: [0, -4, 0],
                          transition: {
                            duration: 0.3,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }
                        } : {
                          y: [0, 2, 0],
                          transition: {
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }
                        }
                      }
                    >
                      <div className="w-full h-full bg-textPrimary rotate-45 transform origin-center shadow-lg" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </button>
          )
        })}

        {/* Dropdown Menu Button */}
        {dropdownItems && dropdownItems.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setHoveredTab('dropdown')}
              onMouseLeave={() => setHoveredTab(null)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-3 rounded-full transition-all duration-300",
                "text-textSecondary hover:text-textPrimary",
                dropdownOpen && "text-textPrimary"
              )}
            >
              <motion.span 
                className="relative z-10"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Settings size={18} strokeWidth={2.5} />
              </motion.span>

              <AnimatePresence>
                {(hoveredTab === 'dropdown' || dropdownOpen) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-accent/10 rounded-full -z-10"
                  />
                )}
              </AnimatePresence>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-surface/95 backdrop-blur-lg border border-border rounded-xl shadow-2xl overflow-hidden z-[9999]"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-textMuted uppercase tracking-wide border-b border-border">
                      Demo Controls
                    </div>
                    {dropdownItems.map((item, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          item.onClick()
                          setDropdownOpen(false)
                        }}
                        disabled={item.disabled}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm font-medium transition-colors",
                          "text-textPrimary hover:bg-accent/10",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "border-b border-border/50 last:border-b-0"
                        )}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon && <item.icon size={16} />}
                          <span>{item.label}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
