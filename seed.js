const { MongoClient } = require("mongodb");
require("dotenv").config();

const lessons = [
  {
    id: 1,
    subject: "Math",
    location: "London",
    price: "50",
    spaces: 5,
    image: "/images/mathematics.jpg",
  },
  {
    id: 2,
    subject: "Physics",
    location: "Manchester",
    price: "60",
    spaces: 5,
    image: "/images/physics.jpg",
  },
  {
    id: 3,
    subject: "Chemistry",
    location: "Birmingham",
    price: "55",
    spaces: 5,
    image: "/images/chemistry.jpg",
  },
  {
    id: 4,
    subject: "Biology",
    location: "Liverpool",
    price: "65",
    spaces: 5,
    image: "/images/biology.jpg",
  },
  {
    id: 5,
    subject: "English Literature",
    location: "Bristol",
    price: "45",
    spaces: 5,
    image: "/images/english.jpg",
  },
  {
    id: 6,
    subject: "History",
    location: "Edinburgh",
    price: "50",
    spaces: 5,
    image: "/images/history.jpg",
  },
  {
    id: 7,
    subject: "Art History",
    location: "Cardiff",
    price: "40",
    spaces: 5,
    image: "/images/art.jpg",
  },
  {
    id: 8,
    subject: "Geography",
    location: "Glasgow",
    price: "55",
    spaces: 5,
    image: "/images/geography.jpg",
  },
  {
    id: 9,
    subject: "Computer Science",
    location: "Manchester",
    price: "75",
    spaces: 5,
    image: "/images/computer.jpg",
  },
  {
    id: 10,
    subject: "Psychology",
    location: "London",
    price: "65",
    spaces: 5,
    image: "/images/psychology.jpg",
  },
  {
    id: 11,
    subject: "Philosophy",
    location: "Cambridge",
    price: "70",
    spaces: 5,
    image: "/images/philosophy.jpg",
  },
  {
    id: 13,
    subject: "Music Theory",
    location: "Nottingham",
    price: "55",
    spaces: 5,
    image: "/images/music.jpg",
  },
  {
    id: 14,
    subject: "Economics",
    location: "Leeds",
    price: "80",
    spaces: 5,
    image: "/images/economics.jpg",
  },
  {
    id: 16,
    subject: "Law",
    location: "Newcastle",
    price: "85",
    spaces: 5,
    image: "/images/law.jpg",
  },
];

(async () => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("LessonApp-3144");
    const lessonsCollection = db.collection("lessons");

    // Clear existing data
    await lessonsCollection.deleteMany({});
    console.log("Existing lessons cleared");

    // Insert new data
    const result = await lessonsCollection.insertMany(lessons);
    console.log("Lessons seeded:", result.insertedCount);

    client.close();
  } catch (err) {
    console.error("Error seeding data:", err);
    client.close();
  }
})();
