# 🚀 Backend Setup & Launch Commands

## Complete Restart Commands for SOL

### 1. Install Node.js Dependencies
```bash
cd /home/tknolast/Desktop/asu_hackathon_2025/tutokenized-simulator/local-executor
npm install
```

### 2. Start Backend Server (with WebSocket support)
```bash
cd /home/tknolast/Desktop/asu_hackathon_2025/tutokenized-simulator/local-executor
node server.js
```
Server will start on: http://localhost:3001

### 3. Test WARP Streaming (in Frontend)
1. Open the frontend in browser
2. Upload `ml_examples/volume.py` or copy its content
3. Click "Execute Code" 
4. Check the Video and Benchmarks tabs for real-time streaming

## Expected Behavior

When you run volume.py:
- ✅ Backend receives WARP simulation frames via stdout
- ✅ Real-time video frames stream to frontend via WebSocket
- ✅ Live performance metrics displayed in Benchmarks tab
- ✅ Interactive video playback controls in Video tab

## Debug Commands

### Check Backend Health
```bash
curl http://localhost:3001/health
```

### Test WebSocket Connection
Open browser console and run:
```javascript
const ws = new WebSocket('ws://localhost:3001');
ws.onopen = () => console.log('WebSocket connected');
ws.onmessage = (event) => console.log('Received:', event.data);
```

### Verify Python Dependencies
```bash
python3 -c "import warp, cv2, matplotlib; print('All WARP dependencies available')"
```

## Troubleshooting

1. **No video/benchmarks showing**: Check browser console for WebSocket connection errors
2. **Backend not starting**: Make sure port 3001 is not in use
3. **Python errors**: Install missing dependencies with pip

## Files Modified for Streaming

- ✅ `local-executor/server.js` - Added WebSocket server & /execute-stream endpoint
- ✅ `src/utils/localExecutor.ts` - Added streaming execution method
- ✅ `src/utils/executorManager.ts` - Added streaming support
- ✅ `src/components/WorkingCodeEditor.tsx` - Auto-detect WARP code for streaming
- ✅ `src/components/WorkspaceTabs.tsx` - Pass streaming data to components
- ✅ `src/components/VideoSimulation.tsx` - Real-time video display
- ✅ `src/components/Benchmarks.tsx` - Live performance metrics
- ✅ `ml_examples/volume.py` - Stream-ready with JSON output
