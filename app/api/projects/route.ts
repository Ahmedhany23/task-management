import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import type {
  ProjectInclude,
  ProjectOrderByWithRelationInput,
  ProjectWhereInput,
} from "@/generated/prisma/models/Project";

const PROJECT_STATUSES = ["ACTIVE", "ARCHIVED", "COMPLETED"] as const;
type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];

function isProjectStatus(value: string): value is ProjectStatusValue {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}

// GET /api/projects - Get all projects for the current user with filtering, sorting, and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;

    // Filtering
    const status = searchParams.get("status"); // ACTIVE, ARCHIVED, COMPLETED
    const search = searchParams.get("search"); // Search by name
    const createdBy = searchParams.get("createdBy"); // Filter by creator ID

    // Sorting
    const sortBy = searchParams.get("sortBy") || "updatedAt"; // name, createdAt, updatedAt
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"; // asc, desc

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Include options
    const includeTasks = searchParams.get("includeTasks") === "true";
    const includeMembers = searchParams.get("includeMembers") === "true";
    const includeCreator = searchParams.get("includeCreator") !== "false"; // default true

    // Build where clause
    const where: ProjectWhereInput = {
      OR: [
        { createdById: user.id },
        {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      ],
    };

    // Add status filter
    const andFilters: ProjectWhereInput[] = [];

    if (status && isProjectStatus(status)) {
      andFilters.push({ status });
    }

    // Add search filter
    if (search) {
      andFilters.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    // Add creator filter
    if (createdBy) {
      andFilters.push({ createdById: createdBy });
    }

    if (andFilters.length > 0) {
      where.AND = andFilters;
    }

    // Build orderBy
    const orderBy: ProjectOrderByWithRelationInput =
      sortBy === "name"
        ? { name: sortOrder }
        : sortBy === "createdAt"
          ? { createdAt: sortOrder }
          : { updatedAt: sortOrder };

    // Build include object
    const include: ProjectInclude = {
      _count: {
        select: {
          tasks: true,
          members: true,
        },
      },
    };

    if (includeCreator) {
      include.createdBy = {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      };
    }

    if (includeTasks) {
      include.tasks = {
        orderBy: {
          order: "asc",
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      };
    }

    if (includeMembers) {
      include.members = {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.project.count({ where });

    // Get projects with pagination
    const projects = await prisma.project.findMany({
      where,
      include,
      orderBy,
      skip,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      data: projects,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rawBody: unknown = await request.json();
    const body =
      typeof rawBody === "object" && rawBody !== null
        ? (rawBody as Record<string, unknown>)
        : {};

    const name = typeof body.name === "string" ? body.name : "";
    const description =
      typeof body.description === "string" ? body.description : undefined;
    const emoji = typeof body.emoji === "string" ? body.emoji : undefined;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    // Create project and add creator as owner member
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        emoji: emoji || null,
        createdById: user.id,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
      include: {
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}

