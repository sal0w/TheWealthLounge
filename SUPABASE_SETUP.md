# Supabase Integration Guide

## Setup Instructions

### 1. Create Supabase Project
1. Go to https://supabase.com/
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project
5. Wait for the project to be ready (~2 minutes)

### 2. Get Your Credentials
1. Go to Project Settings > API
2. Copy the following:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon/public key** (starts with eyJ...)

### 3. Configure Environment Variables
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Schema

Run these SQL commands in Supabase SQL Editor (Dashboard > SQL Editor > New Query):

```sql
-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('normal_user', 'super_user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    investment_company TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create investments table
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    amount_invested DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL CHECK (LENGTH(currency) = 3),
    usd_equivalent DECIMAL(15,2) NOT NULL,
    details_of_investment TEXT,
    expected_yield TEXT,
    investment_type TEXT NOT NULL,
    investment_date DATE NOT NULL,
    maturity_date DATE,
    status TEXT NOT NULL CHECK (status IN ('active', 'matured', 'terminated')),
    contract_pdf TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create performance_projections table
CREATE TABLE performance_projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    principal_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    yield_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(investment_id, year)
);

-- Create indexes for better query performance
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_product_id ON investments(product_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_performance_projections_investment_id ON performance_projections(investment_id);
CREATE INDEX idx_performance_projections_year ON performance_projections(year);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_projections ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users: Can read all users, update own profile
CREATE POLICY "Users can view all users"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Products: Everyone can read, only super_users can modify
CREATE POLICY "Everyone can view products"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Super users can insert products"
    ON products FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_user'
        )
    );

-- Investments: Users see their own, super_users see all
CREATE POLICY "Users can view own investments"
    ON investments FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_user'
        )
    );

CREATE POLICY "Super users can manage investments"
    ON investments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_user'
        )
    );

-- Performance Projections: Follow investment access rules
CREATE POLICY "Users can view projections for accessible investments"
    ON performance_projections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM investments 
            WHERE id = performance_projections.investment_id 
            AND (
                user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE users.id = auth.uid() AND role = 'super_user'
                )
            )
        )
    );

CREATE POLICY "Super users can manage projections"
    ON performance_projections FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_user'
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Seed Initial Data (Optional)

```sql
-- Insert sample users (you'll need to use Supabase Auth for real users)
INSERT INTO users (email, name, role) VALUES
('john.doe@example.com', 'John Doe', 'normal_user'),
('jane.smith@example.com', 'Jane Smith', 'normal_user'),
('admin@example.com', 'Admin User', 'super_user');

-- Insert products
INSERT INTO products (category, investment_company) VALUES
('Loan Notes', 'Woodville'),
('Loan Notes', 'EIGHT Cloud'),
('REIT', 'Assisted Living Project'),
('Loan Notes and Profit Share', 'Acorn (St. Lenard''s Quarter)'),
('Gold', '3RT'),
('Gold', 'Omega Minerals'),
('Private Equity', 'Bricksave'),
('Private Equity', 'Precomb');
```

### 6. Configure Authentication

#### Enable Email/Password Auth:
1. Go to Authentication > Providers
2. Enable "Email" provider
3. Disable "Confirm email" if you want for testing
4. Save

#### Configure Redirect URLs:
1. Go to Authentication > URL Configuration
2. Add your site URL:
   - Local: `http://localhost:3000`
   - Production: `https://your-domain.pages.dev`

### 7. Update Services to Use Supabase

The services are already structured for Supabase migration. Each service file has comments showing how to migrate. Example:

```typescript
// From: lib/mock-data
import { users } from "@/lib/mock-data"

// To: Supabase
import { supabase } from "@/lib/supabase"
const { data, error } = await supabase.from('users').select('*')
```

### 8. Authentication Migration

Replace the current mock authentication with Supabase Auth:

```typescript
// In auth.controller.ts
import { supabase } from "@/lib/supabase"

// Login
const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Logout
await supabase.auth.signOut()
```

### 9. Environment Variables for Cloudflare

Add to Cloudflare Pages Dashboard > Settings > Environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 10. Test the Integration

```bash
# Run development server
npm run dev

# Test login with a Supabase Auth user
# Test data fetching
# Verify RLS policies work correctly
```

## Migration Checklist

- [ ] Supabase project created
- [ ] Database schema created
- [ ] Environment variables configured
- [ ] Authentication enabled
- [ ] RLS policies tested
- [ ] Services migrated from mock data
- [ ] Auth flow updated to use Supabase Auth
- [ ] Cloudflare environment variables set
- [ ] Production deployment tested

## Important Notes

### Security
- RLS policies are enabled and configured
- Use environment variables for sensitive data
- Never commit `.env.local` to git
- Use Supabase Auth for user management

### Performance
- Indexes are created for common queries
- Use `.select()` to only fetch needed columns
- Consider enabling Supabase Realtime for live updates

### Development
- Use `.env.local` for local development
- Use Supabase Studio for database management
- Check Database > Logs for query performance

## Next Steps

1. **Migrate User Service**: Update `/services/user.service.ts`
2. **Migrate Investment Service**: Update `/services/investment.service.ts`
3. **Update Auth Controller**: Replace mock auth with Supabase Auth
4. **Test RLS Policies**: Verify data access controls
5. **Deploy**: Push to Cloudflare with environment variables

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
