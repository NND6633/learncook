// Nơi import: Giữ nguyên đường dẫn từ mẫu của bạn
import { PrismaClient, Prisma } from '../app/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient();

// Dữ liệu mẫu cho model Recipe, theo kiểu Prisma.RecipeCreateInput
const recipeData: Prisma.RecipeCreateInput[] = [
  {
    title: "Spaghetti Carbonara",
    ingredients: "200g Spaghetti\n100g Pancetta\n2 quả trứng lớn\n50g phô mai Pecorino\nTiêu đen",
    tags: ["Quick", "Pasta", "Classic"],
    imageUrl: "https://images.unsplash.com/photo-1588013271500-b37f31a26b6f"
  },
  {
    title: "Bánh mì nướng bơ chay",
    ingredients: "1 lát bánh mì sourdough\n1/2 quả bơ\nMuối\nTiêu\nỚt bột",
    tags: ["Vegan", "Quick", "Breakfast"]
    // imageUrl là tùy chọn (optional), nên có thể bỏ qua
  },
  {
    title: "Bánh quy Sô cô la",
    ingredients: "200g bột mì\n100g bơ\n150g đường\n1 quả trứng\n100g sô cô la chip",
    tags: ["Dessert", "Baking"],
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e"
  },
  {
    title: "Phở Bò",
    ingredients: "Bánh phở\nThịt bò tái\nNước hầm xương\nHành lá, rau thơm\nTương ớt, chanh",
    tags: ["Vietnamese", "Soup", "Noodle"],
    imageUrl: "https://images.unsplash.com/photo-1569718212165-7e94b6841b67"
  }
];

export async function main() {
  console.log(`Bắt đầu seeding...`);
  // Lặp qua mảng recipeData
  for (const r of recipeData) {
    // Tạo một bản ghi Recipe mới cho mỗi mục
    const recipe = await prisma.recipe.create({
      data: r,
    });
    console.log(`Đã tạo công thức với ID: ${recipe.id}`);
  }
  console.log(`Seeding hoàn tất.`);
}

// Chạy hàm main và xử lý việc ngắt kết nối
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });