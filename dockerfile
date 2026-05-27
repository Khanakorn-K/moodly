FROM node:20-alpine
# สร้างไดเรกทอรีแอปพลิเคชันในคอนเทนเนอร์
WORKDIR /app
RUN apk add --no-cache openssl


# คัดลอกไฟล์ package.json และ package-lock.json ไปยังไดเรกทอรี /app ในคอนเทนเนอร์
COPY package*.json /app

# คัดลอกไฟล์ prisma ไปยังไดเรกทอรี /prisma ในคอนเทนเนอร์

COPY prisma ./prisma

RUN npm install -g pnpm

RUN pnpm install
# . ตัวแรงหมายถึงไฟล์ทั้งหมดในไดเรกทอรีปัจจุบัน /app คือไดเรกทอรีเป้าหมายในคอนเทนเนอร์
COPY . /app

# เปิดพอร์ต 3000 สำหรับการเข้าถึงแอปพลิเคชัน 
EXPOSE 3000

# คำสั่งเริ่มต้นเมื่อคอนเทนเนอร์ถูกเรียกใช้ เช่น npm run dev
CMD ["pnpm", "run", "dev"]