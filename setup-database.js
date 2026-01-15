#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Tech ePhi CRM Database Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env file');
} else {
  console.log('📝 Creating new .env file...');
}

// Function to update or add environment variable
function updateEnvVar(key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }
}

// Ask user for database preference
console.log('\n📊 Database Setup Options:');
console.log('1. SQLite (Local development - recommended for testing)');
console.log('2. PostgreSQL (Production - requires database server)');
console.log('3. Supabase (Cloud PostgreSQL - free tier available)');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nChoose your database option (1-3): ', async (choice) => {
  try {
    switch (choice) {
      case '1':
        await setupSQLite();
        break;
      case '2':
        await setupPostgreSQL();
        break;
      case '3':
        await setupSupabase();
        break;
      default:
        console.log('❌ Invalid choice. Using SQLite for development.');
        await setupSQLite();
    }
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
});

async function setupSQLite() {
  console.log('\n🔧 Setting up SQLite database...');
  
  // Update schema to use SQLite
  const sqliteSchemaPath = path.join(__dirname, 'prisma', 'schema.sqlite.prisma');
  const mainSchemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
  
  if (fs.existsSync(sqliteSchemaPath)) {
    fs.copyFileSync(sqliteSchemaPath, mainSchemaPath);
    console.log('✅ Updated schema for SQLite');
  }
  
  // Set SQLite database URL
  updateEnvVar('DATABASE_URL', 'file:./dev.db');
  
  // Save .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env file with SQLite configuration');
  
  // Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema to database
  console.log('🔧 Creating database tables...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n✅ SQLite database setup complete!');
  console.log('📁 Database file: ./prisma/dev.db');
  console.log('🔧 You can now run: npm run dev');
}

async function setupPostgreSQL() {
  console.log('\n🔧 Setting up PostgreSQL database...');
  
  rl.question('Enter your PostgreSQL connection string (e.g., postgresql://user:password@localhost:5432/techephi): ', (connectionString) => {
    if (!connectionString) {
      console.log('❌ Connection string is required');
      return;
    }
    
    // Update database URL
    updateEnvVar('DATABASE_URL', connectionString);
    
    // Save .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with PostgreSQL configuration');
    
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push schema to database
    console.log('🔧 Creating database tables...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('\n✅ PostgreSQL database setup complete!');
    console.log('🔧 You can now run: npm run dev');
  });
}

async function setupSupabase() {
  console.log('\n🔧 Setting up Supabase database...');
  
  console.log('\n📋 To set up Supabase:');
  console.log('1. Go to https://supabase.com');
  console.log('2. Create a new project');
  console.log('3. Go to Settings > Database');
  console.log('4. Copy the connection string');
  
  rl.question('\nEnter your Supabase connection string: ', (connectionString) => {
    if (!connectionString) {
      console.log('❌ Connection string is required');
      return;
    }
    
    // Update database URL
    updateEnvVar('DATABASE_URL', connectionString);
    
    // Save .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with Supabase configuration');
    
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push schema to database
    console.log('🔧 Creating database tables...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('\n✅ Supabase database setup complete!');
    console.log('🔧 You can now run: npm run dev');
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Setup cancelled. You can run this script again later.');
  process.exit(0);
});
