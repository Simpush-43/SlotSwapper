const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');

const Slot = require('../Models/Slot');
const SwapRequest = require('../Models/Swaprequest');

// POST /api/swap-request
router.post('/swap-request', auth, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  if (!mySlotId || !theirSlotId) return res.status(400).json({ error: 'Missing slot ids' });

  try {
    const [mySlot, theirSlot] = await Promise.all([
      Slot.findById(mySlotId),
      Slot.findById(theirSlotId)
    ]);

    if (!mySlot || !theirSlot) return res.status(404).json({ error: 'One or both slots not found' });

    if (!mySlot.owner.equals(req.user._id))
      return res.status(403).json({ error: 'You must own mySlot' });

    if (theirSlot.owner.equals(req.user._id))
      return res.status(400).json({ error: 'Cannot request your own slot' });

    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE')
      return res.status(400).json({ error: 'One or both slots not swappable' });

    // Update slot statuses
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    // Create swap request
    const swap = await SwapRequest.create({
      requester: req.user._id,
      responder: theirSlot.owner,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      status: 'PENDING'
    });

    const populated = await SwapRequest.findById(swap._id)
      .populate('mySlot theirSlot requester responder');
const io = req.app.get("io");
 const onlineUsers = req.app.get("onlineUsers");
 const responderSocket = onlineUsers[theirSlot.owner.toString()];
 if (responderSocket) {
   io.to(responderSocket).emit("swap_request_received", populated);
}
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/swap-response/:requestId
router.post('/swap-response/:requestId', auth, async (req, res) => {
  const { accept } = req.body;
  const { requestId } = req.params;

  try {
    const swapReq = await SwapRequest.findById(requestId);
    if (!swapReq) return res.status(404).json({ error: 'Not found' });

    if (swapReq.status !== 'PENDING')
      return res.status(400).json({ error: 'Request not pending' });

    if (!swapReq.responder.equals(req.user._id))
      return res.status(403).json({ error: 'Not allowed' });

    const mySlot = await Slot.findById(swapReq.mySlot);
    const theirSlot = await Slot.findById(swapReq.theirSlot);

    if (!mySlot || !theirSlot)
      return res.status(404).json({ error: 'Slots not found' });

    if (accept) {
      // Swap owners
      const tempOwner = mySlot.owner;
      mySlot.owner = theirSlot.owner;
      theirSlot.owner = tempOwner;

      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';

      await mySlot.save();
      await theirSlot.save();

      swapReq.status = 'ACCEPTED';
       const io = req.app.get("io");
 const onlineUsers = req.app.get("onlineUsers");
 const requesterSocket = onlineUsers[swapReq.requester.toString()];
 if (requesterSocket) {
   io.to(requesterSocket).emit("swap_request_accepted", populated);
}
      await swapReq.save();
    } else {
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      await mySlot.save();
      await theirSlot.save();

      swapReq.status = 'REJECTED';
      await swapReq.save();
    }

    const populated = await SwapRequest.findById(swapReq._id)
      .populate('mySlot theirSlot requester responder');

    return res.json(populated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// GET /api/swappable-slots  (All slots from other users that are swappable)
router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const slots = await Slot.find({
      status: "SWAPPABLE",
      owner: { $ne: req.user._id } // exclude my own slots
    }).populate("owner", "Firstname email");

    res.json(slots);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
// GET /api/requests/incoming
router.get('/requests/incoming', auth, async (req, res) => {
  try {
    const incoming = await SwapRequest.find({
      responder: req.user._id,
      status: "PENDING"
    }).populate("mySlot theirSlot requester responder");

    res.json(incoming);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});
// GET /api/requests/outgoing
router.get('/requests/outgoing', auth, async (req, res) => {
  try {
    const outgoing = await SwapRequest.find({
      requester: req.user._id
    }).populate("mySlot theirSlot requester responder");

    res.json(outgoing);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
