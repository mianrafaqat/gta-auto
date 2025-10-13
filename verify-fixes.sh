#!/bin/bash

# Verification Script for Deceptive Pages Fix
# This script helps verify that all the fixes are working correctly

echo "========================================="
echo "Verifying Deceptive Pages Fixes"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DOMAIN="${1:-https://garagetunedautos.com}"

echo "Testing domain: $DOMAIN"
echo ""

# Function to test URL
test_url() {
    local url=$1
    local expected=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" == "$expected" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
    else
        echo -e "${RED}✗ FAIL${NC} (Expected HTTP $expected, got HTTP $response)"
    fi
}

# Function to check headers
check_headers() {
    local url=$1
    local header=$2
    local value=$3
    local description=$4
    
    echo -n "Checking $description... "
    
    header_value=$(curl -s -I "$url" | grep -i "$header" | grep -i "$value")
    
    if [ -n "$header_value" ]; then
        echo -e "${GREEN}✓ PASS${NC}"
    else
        echo -e "${RED}✗ FAIL${NC} (Header not found or incorrect)"
    fi
}

echo "1. Testing Demo Auth Pages (should return 404)"
echo "------------------------------------------------"
test_url "$DOMAIN/auth/amplify/login/" "404" "Amplify login"
test_url "$DOMAIN/auth/auth0/login/" "404" "Auth0 login"
test_url "$DOMAIN/auth/firebase/login/" "404" "Firebase login"
test_url "$DOMAIN/auth/supabase/login/" "404" "Supabase login"
test_url "$DOMAIN/auth-demo/classic/login/" "404" "Classic demo login"
test_url "$DOMAIN/auth-demo/modern/login/" "404" "Modern demo login"
echo ""

echo "2. Testing Main Auth Pages (should work but not indexed)"
echo "------------------------------------------------"
test_url "$DOMAIN/login/" "200" "Main login page"
test_url "$DOMAIN/register/" "200" "Register page"
echo ""

echo "3. Checking Noindex Headers"
echo "------------------------------------------------"
check_headers "$DOMAIN/login/" "X-Robots-Tag" "noindex" "Login noindex header"
check_headers "$DOMAIN/dashboard/" "X-Robots-Tag" "noindex" "Dashboard noindex header"
echo ""

echo "4. Testing Public Pages (should work and be indexed)"
echo "------------------------------------------------"
test_url "$DOMAIN/" "200" "Homepage"
test_url "$DOMAIN/product/" "200" "Products page"
test_url "$DOMAIN/about-us/" "200" "About page"
test_url "$DOMAIN/contact-us/" "200" "Contact page"
echo ""

echo "========================================="
echo "Verification Complete!"
echo "========================================="
echo ""
echo "Next Steps:"
echo "1. If all tests pass, deploy to production"
echo "2. Submit URLs for removal in Google Search Console"
echo "3. Request reconsideration for deceptive pages"
echo "4. Monitor Google Search Console for updates"
echo ""
echo "For detailed instructions, see: GOOGLE_DECEPTIVE_PAGES_FIX.md"

