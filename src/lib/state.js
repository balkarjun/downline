const states = {
  STOPPED: 0,
  isStopped: x => x === states.STOPPED,
  STARTING: 1,
  isStarting: x => x === states.STARTING,
  DOWNLOADING: 2,
  isDownloading: x => x === states.DOWNLOADING,
  PROCESSING: 3,
  isProcessing: x => x === states.PROCESSING,
  PAUSED: 4,
  isPaused: x => x === states.PAUSED,
  QUEUED: 5,
  isQueued: x => x === states.QUEUED,
  COMPLETED: 6,
  isCompleted: x => x === states.COMPLETED
};

export default states;
