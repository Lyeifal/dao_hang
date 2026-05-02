import { createInterface } from 'node:readline';
import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((res) => rl.question(question, res));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'untitled';
}

function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function main() {
  console.log('\n📝 创建新的公告 / 更新日志\n');

  const typeInput = await ask('类型 (1=通知公告, 2=更新日志): ');
  const type = typeInput.trim() === '2' ? 'changelog' : 'announcement';
  const typeLabel = type === 'changelog' ? '更新日志' : '通知公告';

  const title = await ask('标题: ');
  if (!title.trim()) {
    console.log('❌ 标题不能为空');
    rl.close();
    return;
  }

  const description = await ask('简介（可选，直接回车跳过）: ');

  const date = today();

  // 生成文件名
  let filename;
  if (type === 'changelog') {
    const version = await ask('版本号（可选，如 v1.0.1，直接回车则使用日期）: ');
    filename = version.trim()
      ? `changelog-${version.trim().toLowerCase()}`
      : `changelog-${date}`;
  } else {
    const useSlug = await ask(`文件名（直接回车使用默认: ${slugify(title)}）: `);
    filename = useSlug.trim() || slugify(title);
  }

  const filepath = resolve(`src/content/docs/${filename}.md`);

  if (existsSync(filepath)) {
    console.log(`❌ 文件已存在: ${filepath}`);
    rl.close();
    return;
  }

  const content = `---
title: ${title.trim()}
${description.trim() ? `description: ${description.trim()}` : `description: ''`}
date: ${date}
category: ${type}
---

<!-- 在此输入正文内容 -->
`;

  writeFileSync(filepath, content, 'utf-8');

  console.log(`\n✅ ${typeLabel}已创建: src/content/docs/${filename}.md`);
  console.log('📌 接下来：');
  console.log('   1. 编辑该 Markdown 文件，写入正文内容');
  console.log('   2. 运行 npm run build 重新构建');
  console.log('   3. 部署 dist/ 目录即可\n');

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
