"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Editor from "@monaco-editor/react";
import { Saider } from "signify-ts";
import { Download, Plus, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Attribute {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

// Build the schema JSON structure - moved outside component to prevent render issues
function buildSchema(
  title: string,
  description: string,
  credentialType: string,
  version: string,
  attributes: Attribute[]
): any {
  try {
    // Build attributes block properties
    const attributeProperties: any = {
      d: {
        description: "Attributes block SAID",
        type: "string",
      },
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

    // Add custom attributes
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

    // Calculate attributes block SAID (we'll calculate this after)
    // Note: Saider.saidify requires a 'd' field (will be filled with SAID)
    const attributesBlock: any = {
      d: "", // Required by Saider.saidify - will be filled with SAID
      description: "Attributes block",
      type: "object",
      properties: attributeProperties,
      additionalProperties: false,
      required: attributeRequired,
    };

    // Calculate attributes block SAID
    const [attributesBlockWithSaid, attributesSaidObject] = Saider.saidify(attributesBlock);
    // Extract the SAID from the 'd' field of the returned object
    const attributesSaid = attributesSaidObject?.d ? String(attributesSaidObject.d) : "";
    // Set the $id for JSON Schema
    attributesBlock.$id = attributesSaid;

    const schema: any = {
      $id: "", // Will be calculated from the schema
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
            attributesBlock,
          ],
        },
      },
      additionalProperties: false,
      required: ["i", "ri", "s", "d"],
    };

    return schema;
  } catch (error: any) {
    console.error("Error in buildSchema:", error);
    throw new Error(`Failed to build schema: ${error?.message || "Unknown error"}`);
  }
}

export default function SchemaBuilder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [credentialType, setCredentialType] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [attributes, setAttributes] = useState<Attribute[]>([
    { name: "attendeeName", type: "string", description: "The name of the attendee", required: true },
  ]);
  const [schemaJson, setSchemaJson] = useState("");
  const [calculatedSaid, setCalculatedSaid] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Calculate SAID from schema
  const calculateSaid = async () => {
    if (!title.trim() || !credentialType.trim()) {
      setValidationError("Title and Credential Type are required");
      setIsValid(false);
      setCalculatedSaid("");
      setSchemaJson("");
      return;
    }

    setIsCalculating(true);
    setValidationError(null);

    try {
      const schema = buildSchema(title, description, credentialType, version, attributes);
      
      // Debug: Log the schema object to see what it looks like
      console.log("Built schema object (before SAID):", schema);
      console.log("Schema $id before:", schema.$id);
      console.log("Schema type:", typeof schema);
      
      // Ensure schema is a valid object
      if (!schema || typeof schema !== 'object') {
        throw new Error("Failed to build schema");
      }
      
      // Calculate SAID from the schema (excluding $id temporarily, but including d field)
      const schemaWithoutId = { ...schema };
      delete schemaWithoutId.$id;
      // Add 'd' field required by Saider.saidify
      schemaWithoutId.d = "";
      
      console.log("Schema without $id (for SAID calculation):", schemaWithoutId);
      
      let saidString: string;
      try {
        const [schemaWithSaid, saidObject] = Saider.saidify(schemaWithoutId);
        console.log("Saider.saidify result - schemaWithSaid:", schemaWithSaid);
        console.log("Saider.saidify result - saidObject:", saidObject);
        console.log("saidObject type:", typeof saidObject);
        console.log("saidObject.d:", saidObject?.d);
        
        // The SAID is in the 'd' field of the returned object
        if (!saidObject || typeof saidObject !== 'object' || !saidObject.d) {
          console.error("SAID not found in saidObject.d! saidObject:", saidObject);
          throw new Error(`SAID calculation failed: 'd' field not found in result`);
        }
        
        // Extract the SAID string from the 'd' field
        saidString = String(saidObject.d);
        console.log("saidString extracted from saidObject.d:", saidString);
        console.log("saidString type:", typeof saidString);
      } catch (saidError: any) {
        console.error("Error in SAID calculation:", saidError);
        // If SAID calculation fails, throw a clean error without the schema object
        throw new Error(`Failed to calculate SAID: ${saidError?.message || "Unknown error"}`);
      }
      
      // Create a new schema object with the SAID, don't mutate the original
      const finalSchema = {
        ...schema,
        $id: saidString
      };
      
      console.log("Final schema $id:", finalSchema.$id);
      console.log("Final schema $id type:", typeof finalSchema.$id);
      
      // Set the $id to the calculated SAID
      schema.$id = saidString;
      
      // Remove the 'd' field from the final schema (it's only needed for SAID calculation)
      delete schema.d;
      
      // Also remove 'd' from the attributes block in the oneOf array
      if (schema.properties?.a?.oneOf?.[1]) {
        delete schema.properties.a.oneOf[1].d;
      }
      
      setCalculatedSaid(saidString);
      setSchemaJson(JSON.stringify(schema, null, 2));
      setIsValid(true);
      setValidationError(null);
    } catch (error: any) {
      console.error("Failed to calculate SAID:", error);
      const errorMessage = error?.message || error?.toString() || "Failed to calculate SAID";
      setValidationError(typeof errorMessage === 'string' ? errorMessage : "Failed to calculate SAID");
      setIsValid(false);
      setCalculatedSaid("");
      setSchemaJson("");
    } finally {
      setIsCalculating(false);
    }
  };

  // Set mounted flag on component mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Removed auto-calculation - user will click "Calculate SAID" button instead

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", type: "string", description: "", required: false }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: keyof Attribute, value: string | boolean) => {
    const updated = [...attributes];
    updated[index] = { ...updated[index], [field]: value };
    setAttributes(updated);
  };

  const downloadSchema = () => {
    if (!schemaJson) return;

    const blob = new Blob([schemaJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${credentialType || "schema"}_${calculatedSaid.slice(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schema Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Rare EVO 2024 Attendee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialType">
                Credential Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="credentialType"
                value={credentialType}
                onChange={(e) => setCredentialType(e.target.value)}
                placeholder="e.g., RareEvo2024AttendeeCredential"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="e.g., 1.0.0"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this credential represents..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attributes</CardTitle>
            <Button onClick={addAttribute} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Attribute
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {attributes.map((attr, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
              <div className="md:col-span-3 space-y-2">
                <Label>Name</Label>
                <Input
                  value={attr.name}
                  onChange={(e) => updateAttribute(index, "name", e.target.value)}
                  placeholder="attributeName"
                  className="font-mono text-sm"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Type</Label>
                <select
                  value={attr.type}
                  onChange={(e) => updateAttribute(index, "type", e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  <option value="array">array</option>
                  <option value="object">object</option>
                </select>
              </div>
              <div className="md:col-span-5 space-y-2">
                <Label>Description</Label>
                <Input
                  value={attr.description}
                  onChange={(e) => updateAttribute(index, "description", e.target.value)}
                  placeholder="Attribute description"
                />
              </div>
              <div className="md:col-span-1 space-y-2">
                <Label>Required</Label>
                <input
                  type="checkbox"
                  checked={attr.required}
                  onChange={(e) => updateAttribute(index, "required", e.target.checked)}
                  className="h-9 w-9 rounded border"
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button
                  onClick={() => removeAttribute(index)}
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Schema</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={calculateSaid}
                disabled={isCalculating || !title.trim() || !credentialType.trim()}
                size="sm"
                variant="outline"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  "Calculate SAID"
                )}
              </Button>
              {isValid && calculatedSaid && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Valid</span>
                </div>
              )}
              {validationError && (
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Error</span>
                </div>
              )}
              {calculatedSaid && (
                <Button onClick={downloadSchema} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {calculatedSaid && (
            <div className="space-y-2">
              <Label>Schema SAID</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <code className="text-sm font-mono flex-1">{calculatedSaid}</code>
                <Button
                  onClick={() => navigator.clipboard.writeText(calculatedSaid)}
                  size="sm"
                  variant="ghost"
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

          {validationError && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Schema JSON</Label>
            <div className="border rounded-md overflow-hidden">
              <Editor
                height="400px"
                defaultLanguage="json"
                value={schemaJson}
                onChange={(value) => setSchemaJson(value || "")}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                  automaticLayout: true,
                  readOnly: true,
                }}
                theme="vs-dark"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

