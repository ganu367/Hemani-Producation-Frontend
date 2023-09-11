export default function useGoToLink() {
    const goToLink = (url) => {
        const link = document.createElement('a');
        link.href = `http://${url}`;
        link.setAttribute("target","_blank");
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    return goToLink;
}