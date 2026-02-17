import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const { projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

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

    // Check if user has permission to access this project
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId: user.id },
        },
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is a member of the project or is the creator
    const isMember = existingProject.members.length > 0;
    const isCreator = existingProject.createdById === user.id;

    if (!isMember && !isCreator) {
      return NextResponse.json(
        { error: "You don't have permission to access this project" },
        { status: 403 },
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;

    // Filtering
    const status = searchParams.get("status"); // TODO, IN_PROGRESS, DONE, etc.
    const search = searchParams.get("search"); // Search by title
    const createdBy = searchParams.get("createdBy"); // Filter by creator ID
    const assignedTo = searchParams.get("assignedTo"); // Filter by assignee ID

    // Sorting
    const sortBy = searchParams.get("sortBy") || "order"; // title, createdAt, updatedAt, order
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Include options
    const includeCreator = searchParams.get("includeCreator") !== "false"; // default true
    const includeAssignee = searchParams.get("includeAssignee") !== "false"; // default true

    // Build where clause for tasks
    const where: any = {
      projectId: projectId,
    };

    // Add filters
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
      ];
    }

    if (createdBy) {
      where.createdById = createdBy;
    }

    if (assignedTo) {
      where.assignedToId = assignedTo;
    }

    // Build orderBy
    const orderBy: any =
      sortBy === "title"
        ? { title: sortOrder }
        : sortBy === "createdAt"
          ? { createdAt: sortOrder }
          : sortBy === "updatedAt"
            ? { updatedAt: sortOrder }
            : { order: sortOrder };

    // Build include object
    const include: any = {};

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

    if (includeAssignee) {
      include.assignedTo = {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.task.count({ where });

    // Get tasks with pagination
    const tasks = await prisma.task.findMany({
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
      data: tasks,
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
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}
