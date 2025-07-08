"use client"

import { createContext, useContext, useState } from "react"

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = "info") => {
    const id = Date.now()
    const notification = { id, message, type }
    setNotifications((prev) => [...prev, notification])

    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        )
      case "error":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )
      case "warning":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        )
      case "info":
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        )
    }
  }

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="rf-notifications-container">
        {notifications.map((notification) => (
          <div key={notification.id} className={`rf-notification rf-notification-${notification.type}`}>
            <div className="rf-notification-content">
              <div className="rf-notification-icon">{getNotificationIcon(notification.type)}</div>
              <p className="rf-notification-message">{notification.message}</p>
              <button onClick={() => removeNotification(notification.id)} className="rf-notification-close">
                ×
              </button>
            </div>
            <div className="rf-notification-progress"></div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
