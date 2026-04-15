#!/bin/bash

# ===========================================
# Sigma Tracker APK Builder Script
# ===========================================
# تطبيق سيجما تراكير - رجل سيجما
# يعمل بدون اتصال بالإنترنت
# ===========================================

echo "=========================================="
echo "   سيجما تراكير - Sigma Tracker APK Builder"
echo "=========================================="
echo ""

# ألوان
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# التحقق من وجود Node.js
echo -e "${YELLOW}[1/5] فحص Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js غير موجود!${NC}"
    echo "يرجى تثبيت Node.js من: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js موجود${NC}"

# التحقق من وجود npm
echo -e "${YELLOW}[2/5] فحص npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm غير موجود!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm موجود${NC}"

# تثبيت التبعيات
echo -e "${YELLOW}[3/5] تثبيت التبعيات...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ فشل تثبيت التبعيات!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ تم تثبيت التبعيات${NC}"

# بناء التطبيق
echo -e "${YELLOW}[4/5] بناء التطبيق...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ فشل بناء التطبيق!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ تم بناء التطبيق${NC}"

# مزامنة Capacitor
echo -e "${YELLOW}[5/5] مزامنة Android...${NC}"
npx cap sync android
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ فشل مزامنة Android!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ تم مزامنة Android${NC}"

# بناء APK
echo ""
echo -e "${YELLOW}=========================================="
echo -e "   بناء APK...${NC}"
echo -e "${YELLOW}==========================================${NC}"

cd android

# منح صلاحيات Gradle
chmod +x gradlew

# بناء APK
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo -e "   🎉 تم بناء APK بنجاح!${NC}"
    echo -e "${GREEN}==========================================${NC}"
    echo ""
    echo -e "📱 ملف APK موجود في:"
    echo -e "${GREEN}android/app/build/outputs/apk/debug/app-debug.apk${NC}"
    echo ""
    echo -e "📋 لحذف كلمة 'debug' من اسم التطبيق:"
    echo -e "   ./gradlew assembleRelease"
    echo ""
else
    echo -e "${RED}❌ فشل بناء APK!${NC}"
    echo "تحقق من تثبيت Android SDK"
fi
