import os

# Nombres de carpetas o archivos a ignorar
IGNORE_DIRS = {'.git', '.idea', 'target', 'build', '.mvn', 'wrapper'}
IGNORE_FILES = {'mvnw', 'mvnw.cmd', '.gitignore'}
EXTENSIONS = {'.java', '.xml', '.yml', '.properties'}

output_file = 'contexto_proyecto.txt'

with open(output_file, 'w', encoding='utf-8') as outfile:
    for root, dirs, files in os.walk("."):
        # Filtrar directorios ignorados
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            if file in IGNORE_FILES: continue
            if not any(file.endswith(ext) for ext in EXTENSIONS): continue
            
            file_path = os.path.join(root, file)
            outfile.write(f"\n--- INICIO ARCHIVO: {file_path} ---\n")
            try:
                with open(file_path, 'r', encoding='utf-8') as infile:
                    outfile.write(infile.read())
            except Exception as e:
                outfile.write(f"Error leyendo archivo: {e}")
            outfile.write(f"\n--- FIN ARCHIVO: {file_path} ---\n")

print(f"¡Listo! Todo tu código está en {output_file}. Súbelo al chat.")