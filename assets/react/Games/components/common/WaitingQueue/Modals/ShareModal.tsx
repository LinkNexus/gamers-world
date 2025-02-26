export default function () {
    return (
        <modal-element id="copy-link-modal" title="Share Link" is-closeable={true} initially-visible={true}>
            <clipboard-element
                id="copy-link"
                label="Share this link to your friend in order to invite them to the game"
                isLink={true}
            >
            </clipboard-element>
        </modal-element>
    );
}