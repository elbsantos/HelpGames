import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

async function importGamblingWebsites() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Ler arquivo JSON com os domínios
    const dataPath = path.join(__dirname, '../data/gambling-websites.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    
    console.log(`📊 Iniciando importação de ${data.length} sites de apostas...`);
    
    // Preparar batch insert
    let inserted = 0;
    let skipped = 0;
    const batchSize = 100;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      for (const site of batch) {
        try {
          await connection.execute(
            'INSERT IGNORE INTO gambling_websites (dominio, nome_site, categoria, pais) VALUES (?, ?, ?, ?)',
            [
              site.dominio || site.domain || site.url,
              site.nome_site || site.name || 'Unknown',
              site.categoria || site.category || 'Geral',
              site.pais || site.country || 'BR'
            ]
          );
          inserted++;
        } catch (error) {
          skipped++;
        }
      }
      
      console.log(`✅ Processados ${Math.min(i + batchSize, data.length)}/${data.length}`);
    }
    
    console.log(`\n✨ Importação concluída!`);
    console.log(`📈 Inseridos: ${inserted}`);
    console.log(`⏭️  Duplicados/Pulados: ${skipped}`);
    
    // Verificar total no banco
    const [result] = await connection.execute('SELECT COUNT(*) as total FROM gambling_websites');
    console.log(`🎯 Total no banco: ${result[0].total}`);
    
  } catch (error) {
    console.error('❌ Erro durante importação:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

importGamblingWebsites();
