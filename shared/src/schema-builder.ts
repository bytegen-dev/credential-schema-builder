import { Saider, MtrDex, Serials } from "signify-ts";
import { Attribute, SchemaMetadata, SchemaResponse } from "./types.js";

export function buildSchema(
  title: string,
  description: string,
  credentialType: string,
  version: string,
  attributes: Attribute[]
): any {
  try {
    const attributeProperties: any = {
      i: {
        description: "Issuee AID",
        type: "string",
      },
      dt: {
        description: "Issuance date time",
        type: "string",
        format: "date-time",
      },
    };

    const attributeRequired = ["i", "dt"];

    attributes.forEach((attr) => {
      if (attr.name.trim()) {
        attributeProperties[attr.name] = {
          description: attr.description || `${attr.name} attribute`,
          type: attr.type,
        };
        if (attr.required) {
          attributeRequired.push(attr.name);
        }
      }
    });

    const attributesBlock: any = {
      $id: "",
      description: "Attributes block",
      type: "object",
      properties: attributeProperties,
      additionalProperties: false,
      required: attributeRequired,
    };

    const [attributesBlockWithSaid, attributesSaidObject] = Saider.saidify(
      attributesBlock,
      MtrDex.Blake3_256,
      Serials.JSON,
      "$id"
    );

    const attributesSaid = attributesSaidObject?.$id
      ? String(attributesSaidObject.$id)
      : "";

    const attributesBlockSchema = {
      description: "Attributes block",
      type: "object",
      properties: attributeProperties,
      additionalProperties: false,
      required: attributeRequired,
    };

    const schema: any = {
      $id: "",
      $schema: "http://json-schema.org/draft-07/schema#",
      title: title || "Untitled Credential",
      description: description || "",
      type: "object",
      credentialType: credentialType || "",
      version: version || "1.0.0",
      properties: {
        v: {
          description: "Version",
          type: "string",
        },
        d: {
          description: "Credential SAID",
          type: "string",
        },
        u: {
          description: "One time use nonce",
          type: "string",
        },
        i: {
          description: "Issuee AID",
          type: "string",
        },
        ri: {
          description: "Credential status registry",
          type: "string",
        },
        s: {
          description: "Schema SAID",
          type: "string",
        },
        a: {
          oneOf: [
            {
              description: "Attributes block SAID",
              type: "string",
            },
            attributesBlockSchema,
          ],
        },
      },
      additionalProperties: false,
      required: ["i", "ri", "s", "d"],
    };

    return schema;
  } catch (error: any) {
    console.error("Error in buildSchema:", error);
    throw new Error(
      `Failed to build schema: ${error?.message || "Unknown error"}`
    );
  }
}

export async function calculateSchemaSaid(
  metadata: SchemaMetadata
): Promise<SchemaResponse> {
  const { title, description, credentialType, version, attributes } = metadata;

  if (!title.trim() || !credentialType.trim()) {
    throw new Error("Title and Credential Type are required");
  }

  const schema = buildSchema(title, description, credentialType, version, attributes);

  if (!schema || typeof schema !== "object") {
    throw new Error("Failed to build schema");
  }

  let saidString: string;
  try {
    const [schemaWithSaid, saidObject] = Saider.saidify(
      schema,
      MtrDex.Blake3_256,
      Serials.JSON,
      "$id"
    );

    if (!saidObject || typeof saidObject !== "object" || !saidObject.$id) {
      throw new Error(`SAID calculation failed: '$id' field not found in result`);
    }

    saidString = String(saidObject.$id);
  } catch (saidError: any) {
    throw new Error(
      `Failed to calculate SAID: ${saidError?.message || "Unknown error"}`
    );
  }

  schema.$id = saidString;

  const attributesBlock: any = {
    $id: "",
    description: "Attributes block",
    type: "object",
    properties: {
      i: { description: "Issuee AID", type: "string" },
      dt: { description: "Issuance date time", type: "string", format: "date-time" },
    },
    additionalProperties: false,
    required: ["i", "dt"],
  };

  attributes.forEach((attr) => {
    if (attr.name.trim()) {
      attributesBlock.properties[attr.name] = {
        description: attr.description || `${attr.name} attribute`,
        type: attr.type,
      };
      if (attr.required) {
        attributesBlock.required.push(attr.name);
      }
    }
  });

  const [_, attributesSaidObject] = Saider.saidify(
    attributesBlock,
    MtrDex.Blake3_256,
    Serials.JSON,
    "$id"
  );

  const attributesSaid = attributesSaidObject?.$id
    ? String(attributesSaidObject.$id)
    : "";

  return {
    schema,
    said: saidString,
    attributesSaid,
  };
}

