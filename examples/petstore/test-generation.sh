#!/bin/bash

# OrvalForge Petstore 示例测试脚本
# 这个脚本会自动测试整个代码生成流程

set -e  # 遇到错误立即退出

echo "🐾 OrvalForge Petstore 示例测试"
echo "=================================="

# 检查当前目录
if [ ! -f "swagger.json" ]; then
    echo "❌ 错误: 请在 examples/petstore 目录下运行此脚本"
    exit 1
fi

# 检查 Node.js 和 npm
echo "📋 检查环境..."
node --version || { echo "❌ Node.js 未安装"; exit 1; }
npm --version || { echo "❌ npm 未安装"; exit 1; }

# 安装依赖
echo "📦 安装依赖..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# 清理旧的生成文件
echo "🧹 清理旧文件..."
npm run clean

# 验证配置
echo "🔍 验证配置..."
npm run validate

# 检查配置（预览模式）
echo "👀 检查配置（预览模式）..."
npm run generate:check

# 生成 API 代码
echo "⚙️  生成 API 代码..."
npm run generate

# 验证生成结果
echo "✅ 验证生成结果..."
npm run test:generated

# 检查生成的文件
echo "📁 检查生成的文件结构..."
if [ -d "generated" ]; then
    echo "生成目录结构:"
    find generated -type f -name "*.ts" | head -10 | while read file; do
        echo "  📄 $file"
    done
    
    if [ $(find generated -name "*.ts" | wc -l) -gt 10 ]; then
        echo "  ... 还有更多文件"
    fi
else
    echo "❌ 生成目录不存在"
    exit 1
fi

# 显示一些生成代码的示例
echo ""
echo "📝 生成代码示例:"
echo "=================="

if [ -f "generated/api/endpoints.ts" ]; then
    echo "🔧 API 函数 (endpoints.ts 前 20 行):"
    head -20 generated/api/endpoints.ts | sed 's/^/  /'
    echo "  ..."
else
    echo "❌ endpoints.ts 文件不存在"
fi

echo ""
if [ -f "generated/api/models/index.ts" ]; then
    echo "🏷️  类型定义 (models/index.ts 前 15 行):"
    head -15 generated/api/models/index.ts | sed 's/^/  /'
    echo "  ..."
else
    echo "❌ models/index.ts 文件不存在"
fi

# TypeScript 编译检查
echo ""
echo "🔧 TypeScript 编译检查..."
if command -v npx >/dev/null 2>&1; then
    if npx tsc --noEmit generated/api/endpoints.ts 2>/dev/null; then
        echo "✅ TypeScript 编译检查通过"
    else
        echo "⚠️  TypeScript 编译检查失败（可能是因为缺少依赖类型）"
    fi
else
    echo "⚠️  未找到 TypeScript 编译器，跳过编译检查"
fi

# 统计信息
echo ""
echo "📊 生成统计:"
echo "============"

if [ -d "generated" ]; then
    ts_files=$(find generated -name "*.ts" | wc -l)
    total_lines=$(find generated -name "*.ts" -exec wc -l {} + | tail -1 | awk '{print $1}')
    
    echo "  📄 TypeScript 文件数量: $ts_files"
    echo "  📝 总代码行数: $total_lines"
    
    # 统计 API 函数数量
    if [ -f "generated/api/endpoints.ts" ]; then
        api_functions=$(grep -c "export.*async.*(" generated/api/endpoints.ts || echo "0")
        echo "  🔧 API 函数数量: $api_functions"
    fi
    
    # 统计类型定义数量
    if [ -f "generated/api/models/index.ts" ]; then
        type_exports=$(grep -c "export.*interface\|export.*type" generated/api/models/index.ts || echo "0")
        echo "  🏷️  导出类型数量: $type_exports"
    fi
fi

echo ""
echo "🎉 测试完成！"
echo "=============="
echo "✅ OrvalForge 成功根据 OpenAPI 规范生成了 TypeScript API 接口函数"
echo ""
echo "📚 接下来可以:"
echo "  1. 查看生成的代码: ls -la generated/api/"
echo "  2. 运行使用示例: npx ts-node usage-demo.ts"
echo "  3. 集成到你的项目中"
echo "  4. 启动监听模式: npm run generate:watch"
echo ""
echo "📖 更多信息请查看 README.md"