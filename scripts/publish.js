import { readdirSync, readFileSync, writeFileSync, existsSync, renameSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((res) => rl.question(question, res));
}

function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) || 'untitled';
}

function parseFrontmatter(content) {
  const match = content.trim().match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: null, body: content };

  const raw = match[1];
  const body = match[2];
  const fm = {};
  for (const line of raw.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      fm[key] = val;
    }
  }
  return { frontmatter: fm, body };
}

function buildFrontmatter(fm) {
  const lines = ['---'];
  if (fm.title) lines.push(`title: ${fm.title}`);
  if (fm.description) lines.push(`description: ${fm.description}`);
  if (fm.date) lines.push(`date: ${fm.date}`);
  if (fm.category) lines.push(`category: ${fm.category}`);
  lines.push('---');
  return lines.join('\n');
}

function extractTitleFromBody(body) {
  const m = body.trim().match(/^#\s+(.+)/m);
  return m ? m[1].trim() : null;
}

async function main() {
  const draftsDir = resolve('drafts');
  const docsDir = resolve('src/content/docs');

  let files;
  try {
    files = readdirSync(draftsDir).filter((f) => f.endsWith('.md'));
  } catch {
    console.log('❌ drafts/ 目录不存在，已自动创建。请将 .md 文件放入该目录后再运行。\n');
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('📭 drafts/ 目录中没有 .md 文件，无需发布。\n');
    rl.close();
    return;
  }

  console.log(`\n📂 发现 ${files.length} 个草稿文件，开始处理...\n`);

  const published = [];
  const skipped = [];

  for (const filename of files) {
    const draftPath = resolve(draftsDir, filename);
    const raw = readFileSync(draftPath, 'utf-8');
    let { frontmatter, body } = parseFrontmatter(raw);

    // 如果没有 frontmatter，尝试从正文提取标题并创建默认 frontmatter
    if (!frontmatter) {
      const titleFromBody = extractTitleFromBody(body);
      if (!titleFromBody) {
        console.log(`⚠️ 跳过 ${filename}：无法识别标题（请在正文第一行写 # 标题，或手动添加 frontmatter）`);
        skipped.push(filename);
        continue;
      }
      frontmatter = {
        title: titleFromBody,
        date: today(),
        category: 'announcement',
      };
    } else {
      // 补齐缺失字段
      if (!frontmatter.title) {
        const titleFromBody = extractTitleFromBody(body);
        if (titleFromBody) frontmatter.title = titleFromBody;
      }
      if (!frontmatter.date) frontmatter.date = today();
      if (!frontmatter.category) frontmatter.category = 'announcement';
    }

    if (!frontmatter.title) {
      console.log(`⚠️ 跳过 ${filename}：缺少标题`);
      skipped.push(filename);
      continue;
    }

    // 生成目标文件名
    let targetName = slugify(frontmatter.title);
    if (frontmatter.category === 'changelog') {
      const v = filename.match(/v?\d+\.\d+\.?\d?/i);
      if (v) targetName = `changelog-${v[0].toLowerCase()}`;
    }

    let targetPath = resolve(docsDir, `${targetName}.md`);
    let counter = 1;
    while (existsSync(targetPath)) {
      targetPath = resolve(docsDir, `${targetName}-${counter}.md`);
      counter++;
    }

    const finalContent = buildFrontmatter(frontmatter) + '\n' + body;
    writeFileSync(targetPath, finalContent, 'utf-8');

    // 删除草稿
    unlinkSync(draftPath);

    const finalName = targetPath.split(/[\\/]/).pop();
    console.log(`✅ 已发布: ${filename} → src/content/docs/${finalName}`);
    published.push(finalName);
  }

  console.log('');

  if (published.length > 0) {
    const doBuild = await ask('是否立即构建站点？ (y/n): ');
    if (doBuild.trim().toLowerCase() === 'y') {
      console.log('');
      const { execSync } = await import('node:child_process');
      try {
        execSync('npm run build', { stdio: 'inherit', cwd: resolve('.') });
        console.log('\n🎉 发布并构建完成！\n');
      } catch {
        console.log('\n❌ 构建失败，请手动运行 npm run build\n');
        process.exit(1);
      }
    } else {
      console.log('\n📌 请稍后手动运行 npm run build 构建站点\n');
    }
  } else {
    console.log('没有成功发布的文件。\n');
  }

  if (skipped.length > 0) {
    console.log(`⚠️ 跳过的文件: ${skipped.join(', ')}\n`);
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
