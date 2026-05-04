#!/bin/bash

# Nextstay Microservices Start Script
# This script builds and starts all microservices

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Nextstay Microservices - Start Script ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/3] Checking prerequisites...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed${NC}"
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo -e "${RED}Error: Maven is not installed${NC}"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | grep "version" | awk '{print $3}' | tr -d '"')
echo -e "${GREEN}✓ Java $JAVA_VERSION${NC}"

MVN_VERSION=$(mvn -v | grep "Apache Maven" | awk '{print $3}')
echo -e "${GREEN}✓ Maven $MVN_VERSION${NC}"

# Step 2: Build all modules
echo ""
echo -e "${YELLOW}[2/3] Building all modules...${NC}"
cd "$PROJECT_ROOT"
mvn clean install -DskipTests -q

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Step 3: Display service info
echo ""
echo -e "${YELLOW}[3/3] Services information:${NC}"
echo ""
echo -e "${CYAN}Services to start:${NC}"
echo -e "  ${GREEN}✓ Eureka Server${NC}       - http://localhost:8761"
echo -e "  ${GREEN}✓ API Gateway${NC}         - http://localhost:8080"
echo -e "  ${GREEN}✓ Identity Service${NC}    - http://localhost:8081"
echo -e "  ${GREEN}✓ Listing Service${NC}     - http://localhost:8082"
echo -e "  ${GREEN}✓ Booking Service${NC}     - http://localhost:8083"
echo -e "  ${GREEN}✓ Review Service${NC}      - http://localhost:8084"
echo -e "  ${GREEN}✓ Support Service${NC}     - http://localhost:8085"
echo ""

echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Start services in separate terminals:"
echo -e "     ${CYAN}cd eureka-server && mvn spring-boot:run${NC}"
echo -e "     ${CYAN}cd api-gateway && mvn spring-boot:run${NC}"
echo -e "     ${CYAN}cd identity-service && mvn spring-boot:run${NC}"
echo -e "     ${CYAN}cd listing-service && mvn spring-boot:run${NC}"
echo -e "     ${CYAN}cd booking-service && mvn spring-boot:run${NC}"
echo -e "     ${CYAN}cd review-service && mvn spring-boot:run${NC}"
echo -e "     ${CYAN}cd support-service && mvn spring-boot:run${NC}"
echo ""
echo -e "  2. Or use Docker Compose:"
echo -e "     ${CYAN}docker-compose up -d${NC}"
echo ""
echo -e "  3. Check Eureka Dashboard:"
echo -e "     ${CYAN}http://localhost:8761${NC}"
echo ""

echo -e "${GREEN}Ready to start services!${NC}"
