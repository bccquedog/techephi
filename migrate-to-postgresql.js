#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Tech ePhi CRM - PostgreSQL Migration Setup\n');

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

console.log('\n📊 PostgreSQL Database Setup Options:');
console.log('1. Supabase (Recommended - Free Cloud PostgreSQL)');
console.log('2. Local PostgreSQL Installation');
console.log('3. AWS RDS PostgreSQL');
console.log('4. Railway PostgreSQL');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nChoose your PostgreSQL option (1-4): ', async (choice) => {
  try {
    switch (choice) {
      case '1':
        await setupSupabase();
        break;
      case '2':
        await setupLocalPostgreSQL();
        break;
      case '3':
        await setupAWSRDS();
        break;
      case '4':
        await setupRailway();
        break;
      default:
        console.log('❌ Invalid choice. Using Supabase for production.');
        await setupSupabase();
    }
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
});

async function setupSupabase() {
  console.log('\n🔧 Setting up Supabase PostgreSQL...');
  
  console.log('\n📋 To set up Supabase:');
  console.log('1. Go to https://supabase.com');
  console.log('2. Create a new project');
  console.log('3. Go to Settings > Database');
  console.log('4. Copy the connection string');
  console.log('5. Replace "postgres" with "postgresql" in the URL');
  
  rl.question('\nEnter your Supabase connection string: ', (connectionString) => {
    if (!connectionString) {
      console.log('❌ Connection string is required');
      return;
    }
    
    // Update schema to use PostgreSQL
    const postgresSchemaPath = path.join(__dirname, 'prisma', 'schema.postgresql.prisma');
    const mainSchemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
    
    if (fs.existsSync(postgresSchemaPath)) {
      fs.copyFileSync(postgresSchemaPath, mainSchemaPath);
      console.log('✅ Updated schema for PostgreSQL');
    }
    
    // Set PostgreSQL database URL
    updateEnvVar('DATABASE_URL', connectionString);
    
    // Save .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with Supabase configuration');
    
    console.log('\n🔧 Next steps:');
    console.log('1. Run: npx prisma generate');
    console.log('2. Run: npx prisma db push');
    console.log('3. Run: node create-admin.js');
    console.log('4. Start your application: npm run dev');
    
    console.log('\n✅ Supabase PostgreSQL setup complete!');
    console.log('🔧 Your database is now production-ready!');
  });
}

async function setupLocalPostgreSQL() {
  console.log('\n🔧 Setting up Local PostgreSQL...');
  
  console.log('\n📋 Prerequisites:');
  console.log('1. Install PostgreSQL on your machine');
  console.log('2. Create a database named "techephi_crm"');
  console.log('3. Create a user with access to the database');
  
  rl.question('\nEnter your local PostgreSQL connection string (e.g., postgresql://user:password@localhost:5432/techephi_crm): ', (connectionString) => {
    if (!connectionString) {
      console.log('❌ Connection string is required');
      return;
    }
    
    // Update schema to use PostgreSQL
    const postgresSchemaPath = path.join(__dirname, 'prisma', 'schema.postgresql.prisma');
    const mainSchemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
    
    if (fs.existsSync(postgresSchemaPath)) {
      fs.copyFileSync(postgresSchemaPath, mainSchemaPath);
      console.log('✅ Updated schema for PostgreSQL');
    }
    
    // Set PostgreSQL database URL
    updateEnvVar('DATABASE_URL', connectionString);
    
    // Save .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with local PostgreSQL configuration');
    
    console.log('\n🔧 Next steps:');
    console.log('1. Run: npx prisma generate');
    console.log('2. Run: npx prisma db push');
    console.log('3. Run: node create-admin.js');
    console.log('4. Start your application: npm run dev');
    
    console.log('\n✅ Local PostgreSQL setup complete!');
  });
}

async function setupAWSRDS() {
  console.log('\n🔧 Setting up AWS RDS PostgreSQL...');
  
  console.log('\n📋 Prerequisites:');
  console.log('1. AWS RDS PostgreSQL instance running');
  console.log('2. Security group configured for your IP');
  console.log('3. Database credentials');
  
  rl.question('\nEnter your AWS RDS connection string: ', (connectionString) => {
    if (!connectionString) {
      console.log('❌ Connection string is required');
      return;
    }
    
    // Update schema to use PostgreSQL
    const postgresSchemaPath = path.join(__dirname, 'prisma', 'schema.postgresql.prisma');
    const mainSchemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
    
    if (fs.existsSync(postgresSchemaPath)) {
      fs.copyFileSync(postgresSchemaPath, mainSchemaPath);
      console.log('✅ Updated schema for PostgreSQL');
    }
    
    // Set PostgreSQL database URL
    updateEnvVar('DATABASE_URL', connectionString);
    
    // Save .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with AWS RDS configuration');
    
    console.log('\n🔧 Next steps:');
    console.log('1. Run: npx prisma generate');
    console.log('2. Run: npx prisma db push');
    console.log('3. Run: node create-admin.js');
    console.log('4. Start your application: npm run dev');
    
    console.log('\n✅ AWS RDS PostgreSQL setup complete!');
  });
}

async function setupRailway() {
  console.log('\n🔧 Setting up Railway PostgreSQL...');
  
  console.log('\n📋 To set up Railway:');
  console.log('1. Go to https://railway.app');
  console.log('2. Create a new project');
  console.log('3. Add PostgreSQL service');
  console.log('4. Copy the connection string');
  
  rl.question('\nEnter your Railway connection string: ', (connectionString) => {
    if (!connectionString) {
      console.log('❌ Connection string is required');
      return;
    }
    
    // Update schema to use PostgreSQL
    const postgresSchemaPath = path.join(__dirname, 'prisma', 'schema.postgresql.prisma');
    const mainSchemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
    
    if (fs.existsSync(postgresSchemaPath)) {
      fs.copyFileSync(postgresSchemaPath, mainSchemaPath);
      console.log('✅ Updated schema for PostgreSQL');
    }
    
    // Set PostgreSQL database URL
    updateEnvVar('DATABASE_URL', connectionString);
    
    // Save .env file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with Railway configuration');
    
    console.log('\n🔧 Next steps:');
    console.log('1. Run: npx prisma generate');
    console.log('2. Run: npx prisma db push');
    console.log('3. Run: node create-admin.js');
    console.log('4. Start your application: npm run dev');
    
    console.log('\n✅ Railway PostgreSQL setup complete!');
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Migration cancelled. You can run this script again later.');
  process.exit(0);
});
