"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Circle, AlertCircle, Loader2 } from "lucide-react"

interface StatusState {
  isBusy: boolean
  error: string | null
}

interface Status {
  understanding: StatusState
  searching: StatusState
  thinking: StatusState
}

interface StatusIndicatorProps {
  status: Status
  isProcessing: boolean  // Add this to know when processing starts
  startedAt: number
}

const statusLabels = {
  understanding: "Understanding your question...",
  searching: "Searching for relevant information...",
  thinking: "Generating response...",
}

function getStepIcon(state: StatusState) {
  if (state.error) {
    return <AlertCircle className="w-4 h-4 text-destructive" />
  } else if (state.isBusy) {
    return <Loader2 className="w-4 h-4 animate-spin" />
  } else {
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }
}

// Helper to find the current active step
function getCurrentStep(status: Status) {
  const stepOrder = ["understanding", "searching", "thinking"] as const
  return stepOrder.find(step => status[step].isBusy)
}

// export function StatusIndicator({ status }: StatusIndicatorProps) {
//   const [expanded, setExpanded] = useState(true)

//   // Define the step order to ensure consistent rendering
//   const stepOrder = ["understanding", "searching", "thinking"] as const

//   // Find the current active step for the header
//   const activeStep = getCurrentStep(status)

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="mb-4 text-xs border rounded-lg overflow-hidden bg-card"
//     >
//       {/* Header - always visible */}
//       <button
//         onClick={() => setExpanded(!expanded)}
//         className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
//       >
//         <div className="flex items-center gap-2">
//           {getStepIcon(status[activeStep])}
//           <span className="font-medium">
//             {status[activeStep].error || statusLabels[activeStep]}
//           </span>
//         </div>
//         <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
//       </button>

//       {/* Expandable content */}
//       <AnimatePresence>
//         {expanded && (
//           <motion.div
//             initial={{ height: 0 }}
//             animate={{ height: "auto" }}
//             exit={{ height: 0 }}
//             className="overflow-hidden border-t"
//           >
//             <div className="p-2 space-y-0">
//               {stepOrder.map((key) => (
//                 <div key={key} className="flex items-center gap-2 p-2">
//                   {getStepIcon(status[key])}
//                   <span className={status[key].isBusy ? "font-medium" : "text-muted-foreground"}>
//                     {status[key].error || statusLabels[key]}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   )
// }

export const MiniStatusIndicator = ({ status, isProcessing, startedAt }: StatusIndicatorProps) => {
  const activeStep = getCurrentStep(status)
  const label = activeStep ? statusLabels[activeStep] : null;
  const error = activeStep ? status[activeStep].error : null;
  const [elapsedTime, setElapsedTime] = useState(0);

  // useEffect(() => {
  //   console.log("startedAt", startedAt);
  //   if (isProcessing) {
  //     const interval = setInterval(() => {
  //       setElapsedTime(Math.floor((new Date().getTime() - startedAt) / 1000));
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [isProcessing, startedAt]);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-xs"
    >
      {isProcessing && !activeStep && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {error ? (
        <span className="text-destructive">
          {error}
        </span>
      ) : (
        <span className="text-muted-foreground">
          {isProcessing && !activeStep ? (
            "Initializing..."
          ) : label ? (
            label
          ) : (
            <span>
              Thought for {elapsedTime}s
            </span>
          )}
        </span>
      )}
    </motion.div>
  )
}