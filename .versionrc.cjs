//const headerPartial =  '## {{#if @root.linkCompare~}}\n' +
//      '  [{{version}}]\n' +
//      '{{~else}}\n' +
//      '  {{~version}}\n' +
//      '{{~/if}}\n' +
//      '{{~#if title}} "{{title}}"\n' +
//      '{{~/if}}\n' +
//      '{{~#if date}} ({{date}})\n' +
//      '{{/if}}\n'

module.exports = {
  header: '# Changelog\n',
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'refactor', hidden: true },
    { type: 'perf', hidden: true },
    { type: 'chore', hidden: true },
    { type: 'docs', hidden: true },
    { type: 'style', hidden: true },
    { type: 'test', hidden: true }
  ],

  writerOpts: {
    transform: (commit) => {
      const newCommit = { ...commit }

      // 关键：清空 notes，彻底干掉顶部无 hash 的重复 BREAKING CHANGE 区块
      newCommit.notes = []

      // 判断是否为破坏性变更（标题带 !）
      const isBreaking = newCommit.header && /!:\s/.test(newCommit.header)

      if (isBreaking) {
        // 统一归入这一个分组，带 hash 链接，且不再在 Features 中重复出现
        newCommit.type = '⚠ BREAKING CHANGES'
      } else if (newCommit.type === 'feat') {
        newCommit.type = 'Features'
      } else if (newCommit.type === 'fix') {
        newCommit.type = 'Bug Fixes'
      } else return null

      if (typeof newCommit.hash === 'string') {
        newCommit.shortHash = newCommit.hash.substring(0, 7)
      }

      return newCommit
    }
  }
}
