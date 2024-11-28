const express = require("express");
const PORT = 3000;


const app = express();
app.use(express.json());

//  data structure for storing event details
const events = {
  "1": {
    maxCapacity: 50,
    attendees: [],
    waitlist: [],
  },
};

app.post("/api/events/:eventId/attend", (req, res) => {
  const { eventId } = req.params;
  const { attendeeEmail, attendeeName } = req.body;

  // Validate input
  if (!attendeeEmail || !attendeeName) {
    return res.status(400).json({ error: "Missing attendee details." });
  }

  const event = events[eventId];

  // Validate event
  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  const { attendees, waitlist, maxCapacity } = event;

  // Check for duplicate registration
  if (attendees.find((user) => user.email === attendeeEmail) || waitlist.find((user) => user.email === attendeeEmail)) {
    return res.status(400).json({ error: "Duplicate registration is not allowed." });
  }

  // Register attendee or add to waitlist
  if (attendees.length < maxCapacity) {
    attendees.push({ email: attendeeEmail, name: attendeeName });
    return res.status(201).json({ message: "Registration successful.", attendee: { attendeeEmail, attendeeName } });
  } else {
    waitlist.push({ email: attendeeEmail, name: attendeeName });
    return res.status(202).json({
      message: "Event is full. You've been added to the waitlist.",
      waitlistPosition: waitlist.length,
    });
  }
});


app.get('/', (req, res) => {
    res.send('Server is Running')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
