const fs = require('fs');
const path = require('path');

const srcPath = 'D:/bathcrest/frontend/src/app/admin/products/new/page.tsx';
const destPath = 'D:/bathcrest/frontend/src/app/admin/products/[id]/edit/page.tsx';

let content = fs.readFileSync(srcPath, 'utf8');

// Replacements
content = content.replace(
  "import { useRouter } from 'next/navigation';",
  "import { useRouter, useParams } from 'next/navigation';"
);

content = content.replace(
  "export default function AddProductPage() {",
  "export default function EditProductPage() {\n  const params = useParams();\n  const id = params.id as string;"
);

content = content.replace(
  "const [categories, setCategories] = useState<any[]>([]);",
  "const [categories, setCategories] = useState<any[]>([]);\n  const [isLoading, setIsLoading] = useState(true);"
);

content = content.replace(
  "// Auth Check & Fetch Categories",
  "// Auth Check & Fetch Data"
);

content = content.replace(
  /fetch\(\`\$\{API_URL\}\/categories\`\)\s*\.then[\s\S]*?\.catch\(err => console\.error\('Failed to fetch categories:', err\)\);/g,
  `const fetchData = async () => {
      try {
        const catRes = await fetch(\`\${API_URL}/categories\`);
        const catData = await catRes.json();
        if (catData.success) {
          setCategories(catData.categories);
        }

        const prodRes = await fetch(\`\${API_URL}/products/\${id}\`);
        const prodData = await prodRes.json();
        if (prodData.success) {
          const p = prodData.product;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            shortDescription: p.shortDescription || '',
            price: p.price?.toString() || '',
            discountPrice: p.discountPrice?.toString() || '',
            stock: p.stock?.toString() || '0',
            sku: p.sku || '',
            category: p.category?._id || p.category || '',
            brand: p.brand || 'BathCrest',
            isFeatured: !!p.isFeatured,
            isNewArrival: !!p.isNewArrival,
            isBestSeller: !!p.isBestSeller,
            image1: p.images?.[0]?.url || '',
            image2: p.images?.[1]?.url || '',
            image3: p.images?.[2]?.url || ''
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();`
);

content = content.replace(
  "useEffect(() => {",
  "useEffect(() => {\n    if (!id) return;"
);

// Replace dependency array from `[router]` to `[router, id]`
content = content.replace(
  /}, \[router\]\);/g,
  "}, [router, id]);"
);

// Replace POST with PUT
content = content.replace(
  /fetch\(\`\$\{API_URL\}\/products\`,\s*\{\s*method:\s*'POST',/g,
  "fetch(`${API_URL}/products/${id}`, { method: 'PUT',"
);

// Replace success messages
content = content.replace(
  "'Product created successfully!'",
  "'Product updated successfully!'"
);
content = content.replace(
  "'Failed to create product'",
  "'Failed to update product'"
);

// Replace headings
content = content.replace(
  "Add New Product",
  "Edit Product"
);
content = content.replace(
  "Create a new item in your store inventory",
  "Update existing product information"
);

// Add loading state UI
content = content.replace(
  "return (",
  "if (isLoading) return <div className=\"min-h-screen bg-[#0c0a09] flex items-center justify-center text-white\">Loading product details...</div>;\n\n  return ("
);

fs.writeFileSync(destPath, content, 'utf8');
console.log('Edit page created successfully!');
