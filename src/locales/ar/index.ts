// Define the shape of your translations
const files = import.meta.glob('./*.json', { eager: true });

export const ar = Object.entries(files).reduce((acc, [path, content]) => {
  const fileName = path.replace('./', '').replace('.json', '') as keyof typeof ar;
  acc[fileName] = content as any; 
  return acc;
}, {} as Record<string, any>);