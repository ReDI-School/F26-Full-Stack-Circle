import prisma from '../libs/prisma';

export class CategoryService {
  async getAllCategories() {
    return await prisma.category.findMany({
      include: { _count: { select: { items: { where: { sold: false } } } } },
      orderBy: { id: 'asc' },
    });
  }
}
