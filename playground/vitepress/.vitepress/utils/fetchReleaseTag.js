export function fetchReleaseTag() {
  return fetch('https://api.github.com/repos/xinlei3166/vitepress-theme-demoblock/releases/latest')
  .then((res) => res.json())
  .then((json) => json.tag_name ?? '')
  .then(releaseTag => {
    if (!releaseTag) return;
    const tagLineParagragh = document.querySelector('div.VPHero.has-image.VPHomeHero > div > div.main > p.tagline')
    const docsReleaseTagSpan = document.createElement('samp')
    docsReleaseTagSpan.classList.add('docs-github-release-tag')
    docsReleaseTagSpan.innerText = releaseTag
    tagLineParagragh?.appendChild(docsReleaseTagSpan)
  })
}
