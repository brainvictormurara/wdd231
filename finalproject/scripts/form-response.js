const resultsContainer =
    document.querySelector("#form-results");

const parameters =
    new URLSearchParams(window.location.search);

const firstName =
    parameters.get("firstname") || "";

const lastName =
    parameters.get("lastname") || "";

const email =
    parameters.get("email") || "";

const phone =
    parameters.get("phone") || "Not provided";

const company =
    parameters.get("company") || "Not provided";

const product =
    parameters.get("product") || "";

const quantity =
    parameters.get("quantity") || "";

const message =
    parameters.get("message") || "No additional information";

const timestamp =
    parameters.get("timestamp") || "";

resultsContainer.innerHTML = `
    <p>
        <strong>Name:</strong>
        ${firstName} ${lastName}
    </p>

    <p>
        <strong>Email:</strong>
        ${email}
    </p>

    <p>
        <strong>Phone:</strong>
        ${phone}
    </p>

    <p>
        <strong>Company:</strong>
        ${company}
    </p>

    <p>
        <strong>Product:</strong>
        ${product}
    </p>

    <p>
        <strong>Quantity:</strong>
        ${quantity}
    </p>

    <p>
        <strong>Additional Information:</strong>
        ${message}
    </p>

    <p>
        <strong>Submitted:</strong>
        ${timestamp}
    </p>
`;