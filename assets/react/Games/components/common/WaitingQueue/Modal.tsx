export default function () {
    return (
        <div
            data-controller="modals--render"
            data-modals--render-id-value="copy-link"
            data-modals--render-initially-visible-value="true"
            data-modals--render-title-value="Share Link"
        >
            <div
                data-controller="clipboard--render"
                data-clipboard--render-id-value="copy-link"
                data-clipboard--render-label-value="Share this link to your friend in order to invite them to the game"
                data-clipboard--render-is-link-value="true"
            >
            </div>
        </div>
    );
}