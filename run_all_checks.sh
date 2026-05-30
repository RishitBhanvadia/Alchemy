# Type check client
echo "TYPECHECK CLIENT"
cd client && npx tsc --noEmit
cd ..

echo "TYPECHECK SERVER"
cd server && npx tsc --noEmit
cd ..

echo "LINT CLIENT"
cd client && npm run lint
cd ..

echo "LINT SERVER"
cd server && npm run lint || true
cd ..

echo "TEST CLIENT"
cd client && npm test -- --reporter=verbose
cd ..

echo "TEST SERVER"
cd server && npx jest
cd ..

echo "BUILD CLIENT"
cd client && npm run build
cd ..
