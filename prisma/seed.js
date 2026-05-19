const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const freelancersMock = [
  {
    id: "denuwan-sandeepa",
    name: "Sandeepa",
    email: "denuwan@test.com",
    title: "Full Stack Web Developer",
    location: "Galle",
    category: "IT & Software",
    skills: ["Next.js", "React", "TypeScript", "Node.js", "Prisma", "SQLite", "Tailwind CSS"],
    price: "Rs. 12,500",
    rating: 5.0,
    completedJobs: 8,
    experience: "2 Years",
    responseTime: "Within 1 hour",
    description:
      "I am a passionate Full Stack Developer specializing in building high-quality, responsive, and performance-optimized web applications using Next.js, React, TypeScript, Node.js, and Prisma.",
  },
];

const servicesMock = [
  {
    id: "nextjs-fullstack-development",
    title: "I will build a custom Next.js full-stack web application",
    freelancerId: "denuwan-sandeepa",
    category: "IT & Software",
    price: "Rs. 25,000",
    delivery: "5 Days",
    revision: "Unlimited Revisions",
    description:
      "I will build a clean, modern, and highly performant full-stack web application tailored for your business needs using Next.js, React, Prisma, and Tailwind CSS.",
    tags: ["Next.js", "React", "TypeScript", "Prisma"],
  },
];

async function main() {
  console.log("Wiping database existing records...");
  await prisma.review.deleteMany();
  await prisma.hireRequest.deleteMany();
  await prisma.service.deleteMany();
  await prisma.freelancerProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  // 1. Create a dummy Client user for making reviews/hire requests
  console.log("Creating test client user...");
  const clientUser = await prisma.user.create({
    data: {
      id: "test-client",
      name: "Saman Kumara",
      email: "client@test.com",
      password: hashedPassword,
      role: "CLIENT",
      location: "Colombo",
      phone: "+94771234567",
    },
  });

  // 2. Create Freelancer and Profile
  console.log("Creating real freelancer profile...");
  for (const f of freelancersMock) {
    const user = await prisma.user.create({
      data: {
        id: f.id,
        name: f.name,
        email: f.email,
        password: hashedPassword,
        role: "FREELANCER",
        location: f.location,
      },
    });

    const profile = await prisma.freelancerProfile.create({
      data: {
        id: f.id,
        userId: user.id,
        title: f.title,
        bio: f.description,
        category: f.category,
        location: f.location,
        skills: f.skills.join(","),
        experience: f.experience,
        startingPrice: f.price,
        responseTime: f.responseTime,
      },
    });

    // Seed review
    await prisma.review.create({
      data: {
        clientId: clientUser.id,
        freelancerId: user.id,
        rating: Math.round(f.rating),
        comment: "Excellent developer! The work was delivered on time and exceeded expectations. Highly recommended.",
      },
    });

    // Seed completed hire requests
    for (let i = 0; i < f.completedJobs; i++) {
      await prisma.hireRequest.create({
        data: {
          clientId: clientUser.id,
          freelancerId: user.id,
          message: `Project #${i + 1} for ${f.title}`,
          budget: f.price,
          status: "COMPLETED",
        },
      });
    }
  }

  // 3. Create Services
  console.log("Creating services...");
  for (const s of servicesMock) {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { id: s.freelancerId },
    });

    if (profile) {
      await prisma.service.create({
        data: {
          id: s.id,
          freelancerProfileId: profile.id,
          title: s.title,
          description: s.description,
          category: s.category,
          price: s.price,
          delivery: s.delivery,
          revision: s.revision,
          tags: s.tags.join(","),
          isActive: true,
        },
      });
    }
  }

  console.log("Seeding complete! Real freelancer database populated successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
