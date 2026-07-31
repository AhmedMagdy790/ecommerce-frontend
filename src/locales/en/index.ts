// Define the shape of your translations
const files = import.meta.glob('./*.json', { eager: true });

export const en = Object.entries(files).reduce((acc, [path, content]) => {
  const fileName = path.replace('./', '').replace('.json', '') as keyof typeof en;
  acc[fileName] = content as any; 
  return acc;
}, {} as Record<string, any>);