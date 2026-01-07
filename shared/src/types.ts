export interface Attribute {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface SchemaMetadata {
  title: string;
  description: string;
  credentialType: string;
  version: string;
  attributes: Attribute[];
}

export interface SchemaResponse {
  schema: any;
  said: string;
  attributesSaid: string;
}

