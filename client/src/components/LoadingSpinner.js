"use client"

import "./LoadingSpinner.css"

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "rf-loading-small"
      case "large":
        return "rf-loading-large"
      case "xlarge":
        return "rf-loading-xlarge"
      default:
        return "rf-loading-medium"
    }
  }

  return (
    <div className="rf-loading-container">
      <div className={`rf-loading-spinner ${getSizeClass()}`}>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sandy%20Loading-1gRb5Cs4J8jtc37mbmJnhntOP4cvcJ.gif"
          alt="Loading..."
          className="rf-loading-gif"
        />
      </div>
      {text && <p className="rf-loading-text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
