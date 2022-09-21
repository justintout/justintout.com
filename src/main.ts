function main() {
    window.addEventListener('hashchange', (event) => {
        const id = window.location.hash.slice(1);
        const prev = event.oldURL.includes('#') ? event.oldURL.split('#')[1] : '';
        if (prev == '' && id.length) {
            console.log(`hope you enjoy your first article of the visit, "${titleFromSlug(id)} :)"`);
        }
        expandArticle(id);
    });
    if (window.location.hash) {
        const id = window.location.hash.slice(1);
        expandArticle(id);
    }
}

function titleFromSlug(slug: string): string {
    const elems = Array.from(document.querySelectorAll<HTMLHeadingElement>('article > h2'))
        .filter((n) => n.id.toLowerCase() === slug.toLowerCase());
    if (elems.length == 0) {
        return '';
    }
    if (elems.length > 1) {
        console.log(`i have two articles with the same slug! i better fix that...`);
    }
    if (elems[0].textContent == null) {
        return '';
    } 
    return elems[0].textContent;
}

function expandArticle(slug: string) {
    if (slug == '') {
        return;
    }
    const article = document.querySelector<HTMLElement>(`#${slug}`)?.parentElement?.parentElement;
    if (!article) {
        return;
    }
    article.classList.replace('collapsed', 'expanded');
    const a = article?.querySelector<HTMLAnchorElement>(`a.article-expander`);
    if (a) {
        a.text = '...enough';
        a.addEventListener('click', () => {
            collapseArticle(article);
            a.addEventListener('click', () => {
                expandArticle(slug);
            }, {once: true});
            return true;
        }, {once: true});
    }
}

function collapseArticle(article: HTMLElement) {
    article.classList.replace('expanded', 'collapsed');
    const a = article.querySelector<HTMLAnchorElement>(`a.article-expander`);
    if (a) {
        a.text = 'more...';
    }
}

(async () => {
    main();
})();