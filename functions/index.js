/* eslint-disable indent, quotes, no-trailing-spaces, operator-linebreak */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {DocumentProcessorServiceClient} = require("@google-cloud/documentai").v1;
const {Storage} = require("@google-cloud/storage");

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();

const projectId = "759051999457";
const location = "us";
const processorId = "60ea143a1c124db2";

const processorName =
    `projects/${projectId}/locations/${location}/processors/${processorId}`;

const documentaiClient = new DocumentProcessorServiceClient({
    keyFilename: "./service-account.json",
});

/**
 * Process uploaded invoice PDFs using Document AI
 * @param {object} object - Storage object metadata
 */
exports.processInvoice = functions.storage.object().onFinalize(
    async (object) => {
        try {
            const bucketName = object.bucket;
            const fileName = object.name;
            const filePath = `gs://${bucketName}/${fileName}`;

            const [fileBuffer] = await storage
                .bucket(bucketName)
                .file(fileName)
                .download();

            const request = {
                name: processorName,
                rawDocument: {
                    content: fileBuffer,
                    mimeType: "application/pdf",
                },
            };

            const [result] = await documentaiClient.processDocument(request);
            const document = result.document;
            const invoiceData = parseInvoice(document);

            await db.collection("invoices").add({
                ...invoiceData,
                fileUrl: filePath,
                status: "Pending",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`Invoice processed and saved for file: ${filePath}`);
        } catch (error) {
            console.error("Error processing invoice:", error);
        }
    });

/**
 * Extract fields from Document AI response
 * @param {object} document - Parsed Document AI result
 * @return {object} Parsed invoice data
 */
function parseInvoice(document) {
    const fields = {};

    if (document.entities) {
        document.entities.forEach((entity) => {
            fields[entity.type] = entity.mentionText;
        });
    }

    return {
        vendorName: fields["supplier_name"] || "Unknown Vendor",
        invoiceNumber: fields["invoice_id"] || "N/A",
        totalAmount: fields["total_amount"] || "0",
        invoiceDate: fields["invoice_date"] || new Date().toISOString(),
        items: [],
    };
}
