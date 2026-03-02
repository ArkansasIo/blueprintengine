/**
 * Blueprint Import/Export System - Convert blueprints between formats
 * Supports: JSON, YAML, CSV, UE5 Native, XML, SQL
 */

import {
  BlueprintClass,
  BlueprintFunction,
  BlueprintVariable,
  BlueprintEvent,
  BlueprintNode,
  BlueprintEdge,
} from './ue5-blueprint-generator';

export enum ExportFormat {
  JSON = 'json',
  JSON_PRETTY = 'json_pretty',
  YAML = 'yaml',
  XML = 'xml',
  CSV = 'csv',
  UE5_NATIVE = 'ue5_native',
  SQL = 'sql',
  GraphQL = 'graphql',
}

// ===== JSON EXPORT/IMPORT =====

export class JSONBlueprintExporter {
  export(blueprint: BlueprintClass, pretty: boolean = false): string {
    const data = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      blueprint: {
        id: blueprint.id,
        name: blueprint.name,
        displayName: blueprint.displayName,
        baseClass: blueprint.baseClass,
        type: blueprint.type,
        description: blueprint.description,
        category: blueprint.category,
        isPublic: blueprint.isPublic,
        tags: blueprint.tags,
        metadata: blueprint.metadata,
        variables: blueprint.variables,
        functions: blueprint.functions.map((f) => ({
          ...f,
          nodeCount: f.nodes.length,
          edgeCount: f.edges.length,
        })),
        events: blueprint.events.map((e) => ({
          ...e,
          nodeCount: e.nodes.length,
          edgeCount: e.edges.length,
        })),
        components: blueprint.components,
        interfaces: blueprint.interfaces,
        graph: {
          nodeCount: blueprint.eventGraphNodes.length,
          edgeCount: blueprint.eventGraphEdges.length,
        },
      },
    };

    return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  }

  import(jsonString: string): BlueprintClass | null {
    try {
      const data = JSON.parse(jsonString);
      if (!data.blueprint) return null;

      return data.blueprint as BlueprintClass;
    } catch {
      return null;
    }
  }
}

// ===== YAML EXPORT/IMPORT =====

export class YAMLBlueprintExporter {
  export(blueprint: BlueprintClass): string {
    return this.toYAML({
      blueprint: {
        name: blueprint.name,
        type: blueprint.type,
        baseClass: blueprint.baseClass,
        description: blueprint.description,
        variables: blueprint.variables.map((v) => ({
          name: v.name,
          type: v.type,
          default: v.defaultValue,
          category: v.category,
        })),
        functions: blueprint.functions.map((f) => ({
          name: f.name,
          description: f.description,
          inputs: f.inputs.length,
          outputs: f.outputs.length,
          nodes: f.nodes.length,
        })),
        events: blueprint.events.map((e) => ({
          name: e.name,
          inputs: e.inputs.length,
          nodes: e.nodes.length,
        })),
      },
    });
  }

  private toYAML(obj: any, indent = 0): string {
    const spaces = ' '.repeat(indent);
    let yaml = '';

    if (Array.isArray(obj)) {
      obj.forEach((item) => {
        yaml += `${spaces}- ${typeof item === 'object' ? '\n' : ''}`;
        if (typeof item === 'object') {
          yaml += this.toYAML(item, indent + 2);
        } else {
          yaml += `${item}\n`;
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          yaml += `${spaces}${key}:\n`;
          yaml += this.toYAML(value, indent + 2);
        } else if (Array.isArray(value)) {
          yaml += `${spaces}${key}:\n`;
          yaml += this.toYAML(value, indent + 2);
        } else {
          yaml += `${spaces}${key}: ${value}\n`;
        }
      });
    }

    return yaml;
  }
}

// ===== CSV EXPORT =====

export class CSVBlueprintExporter {
  export(blueprint: BlueprintClass): string {
    let csv = 'Blueprint Structure Export\n';
    csv += `Name,${blueprint.name}\n`;
    csv += `Type,${blueprint.type}\n`;
    csv += `Base Class,${blueprint.baseClass}\n`;
    csv += `Description,${blueprint.description}\n\n`;

    // Variables
    csv += 'VARIABLES\n';
    csv += 'Name,Type,Default Value,Category,Instance Editable\n';
    blueprint.variables.forEach((v) => {
      csv += `${v.name},${v.type},${v.defaultValue || ''},${v.category || ''},${v.bInstanceEditable ? 'Yes' : 'No'}\n`;
    });

    csv += '\nFUNCTIONS\n';
    csv += 'Name,Description,Inputs,Outputs,Pure\n';
    blueprint.functions.forEach((f) => {
      csv += `${f.name},${f.description || ''},${f.inputs.length},${f.outputs.length},${f.bPure ? 'Yes' : 'No'}\n`;
    });

    csv += '\nEVENTS\n';
    csv += 'Name,Description,Inputs\n';
    blueprint.events.forEach((e) => {
      csv += `${e.name},${e.description || ''},${e.inputs.length}\n`;
    });

    return csv;
  }
}

// ===== XML EXPORT =====

export class XMLBlueprintExporter {
  export(blueprint: BlueprintClass): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<Blueprint name="${this.escapeXml(blueprint.name)}" type="${blueprint.type}">\n`;
    xml += `  <Metadata>\n`;
    xml += `    <Id>${blueprint.id}</Id>\n`;
    xml += `    <BaseClass>${blueprint.baseClass}</BaseClass>\n`;
    xml += `    <Description>${this.escapeXml(blueprint.description || '')}</Description>\n`;
    xml += `    <Category>${blueprint.category || ''}</Category>\n`;
    xml += `  </Metadata>\n`;

    // Variables
    xml += `  <Variables>\n`;
    blueprint.variables.forEach((v) => {
      xml += `    <Variable name="${this.escapeXml(v.name)}" type="${v.type}">\n`;
      if (v.defaultValue !== undefined) {
        xml += `      <Default>${v.defaultValue}</Default>\n`;
      }
      if (v.category) {
        xml += `      <Category>${v.category}</Category>\n`;
      }
      xml += `    </Variable>\n`;
    });
    xml += `  </Variables>\n`;

    // Functions
    xml += `  <Functions>\n`;
    blueprint.functions.forEach((f) => {
      xml += `    <Function name="${this.escapeXml(f.name)}" pure="${f.bPure}">\n`;
      xml += `      <Description>${this.escapeXml(f.description || '')}</Description>\n`;
      xml += `      <Inputs>${f.inputs.length}</Inputs>\n`;
      xml += `      <Outputs>${f.outputs.length}</Outputs>\n`;
      xml += `      <Nodes>${f.nodes.length}</Nodes>\n`;
      xml += `    </Function>\n`;
    });
    xml += `  </Functions>\n`;

    // Events
    xml += `  <Events>\n`;
    blueprint.events.forEach((e) => {
      xml += `    <Event name="${this.escapeXml(e.name)}">\n`;
      xml += `      <Inputs>${e.inputs.length}</Inputs>\n`;
      xml += `      <Nodes>${e.nodes.length}</Nodes>\n`;
      xml += `    </Event>\n`;
    });
    xml += `  </Events>\n`;

    xml += `</Blueprint>\n`;
    return xml;
  }

  private escapeXml(str: string): string {
    return str.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}

// ===== UE5 NATIVE EXPORT =====

export class UE5NativeExporter {
  export(blueprint: BlueprintClass): string {
    // Generates C++ compatible header for UE5
    let header = `// Generated Blueprint: ${blueprint.name}\n`;
    header += `// Type: ${blueprint.type}\n`;
    header += `// Generated at: ${new Date().toISOString()}\n\n`;

    header += `#pragma once\n\n`;
    header += `#include "CoreMinimal.h"\n`;
    header += `#include "GameFramework/${blueprint.baseClass}.h"\n`;
    header += `#include "${blueprint.name}.generated.h"\n\n`;

    // Forward declarations
    if (blueprint.interfaces.length > 0) {
      header += `// Interfaces\n`;
      blueprint.interfaces.forEach((iface) => {
        header += `class I${iface};\n`;
      });
      header += `\n`;
    }

    // Class declaration
    header += `UCLASS()\n`;
    header += `class ${blueprint.name} : public ${blueprint.baseClass}`;
    if (blueprint.interfaces.length > 0) {
      header += `, ${blueprint.interfaces.map((i) => `public I${i}`).join(', ')}`;
    }
    header += `\n{\n`;
    header += `\tGENERATED_BODY()\n\n`;

    // Variables
    if (blueprint.variables.length > 0) {
      header += `\t// Variables\n`;
      blueprint.variables.forEach((v) => {
        header += `\tUPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "${v.category || 'Variables'}")\n`;
        header += `\t${this.getCppType(v.type)} ${v.name};\n\n`;
      });
    }

    // Functions
    if (blueprint.functions.length > 0) {
      header += `\t// Functions\n`;
      blueprint.functions.forEach((f) => {
        header += `\tUFUNCTION(BlueprintCallable, Category = "${f.category || 'Functions'}")\n`;
        const returnType = f.returnType ? this.getCppType(f.returnType) : 'void';
        header += `\t${returnType} ${f.name}();\n\n`;
      });
    }

    header += `};\n`;
    return header;
  }

  private getCppType(pinType: string): string {
    const typeMap: Record<string, string> = {
      'exec': 'void',
      'bool': 'bool',
      'int32': 'int32',
      'float': 'float',
      'string': 'FString',
      'name': 'FName',
      'text': 'FText',
      'FVector': 'FVector',
      'FRotator': 'FRotator',
      'FTransform': 'FTransform',
      'Object': 'UObject*',
      'Class': 'UClass*',
    };
    return typeMap[pinType] || 'void';
  }
}

// ===== SQL EXPORT =====

export class SQLBlueprintExporter {
  export(blueprint: BlueprintClass): string {
    let sql = `-- Blueprint: ${blueprint.name}\n`;
    sql += `-- Type: ${blueprint.type}\n`;
    sql += `-- Generated at: ${new Date().toISOString()}\n\n`;

    // Blueprints table
    sql += `INSERT INTO Blueprints (name, type, baseClass, description, category) VALUES \n`;
    sql += `('${this.escapeSql(blueprint.name)}', '${blueprint.type}', '${blueprint.baseClass}', '${this.escapeSql(blueprint.description || '')}', '${blueprint.category || 'Generated'}');\n\n`;

    // Variables table
    if (blueprint.variables.length > 0) {
      sql += `INSERT INTO Variables (blueprintId, name, type, defaultValue, category) VALUES \n`;
      blueprint.variables.forEach((v, i) => {
        const comma = i < blueprint.variables.length - 1 ? ',' : ';';
        sql += `((SELECT id FROM Blueprints WHERE name='${this.escapeSql(blueprint.name)}'), '${v.name}', '${v.type}', '${v.defaultValue || 'NULL'}', '${v.category || 'Variables'}')${comma}\n`;
      });
      sql += `\n`;
    }

    // Functions table
    if (blueprint.functions.length > 0) {
      sql += `INSERT INTO Functions (blueprintId, name, description, inputs, outputs, isPure) VALUES \n`;
      blueprint.functions.forEach((f, i) => {
        const comma = i < blueprint.functions.length - 1 ? ',' : ';';
        sql += `((SELECT id FROM Blueprints WHERE name='${this.escapeSql(blueprint.name)}'), '${f.name}', '${this.escapeSql(f.description || '')}', ${f.inputs.length}, ${f.outputs.length}, ${f.bPure ? 1 : 0})${comma}\n`;
      });
    }

    return sql;
  }

  private escapeSql(str: string): string {
    return str.replace(/'/g, "''");
  }
}

// ===== EXPORT MANAGER =====

export class BlueprintExportManager {
  exportAs(blueprint: BlueprintClass, format: ExportFormat): string {
    switch (format) {
      case ExportFormat.JSON:
        return new JSONBlueprintExporter().export(blueprint, false);
      case ExportFormat.JSON_PRETTY:
        return new JSONBlueprintExporter().export(blueprint, true);
      case ExportFormat.YAML:
        return new YAMLBlueprintExporter().export(blueprint);
      case ExportFormat.CSV:
        return new CSVBlueprintExporter().export(blueprint);
      case ExportFormat.XML:
        return new XMLBlueprintExporter().export(blueprint);
      case ExportFormat.UE5_NATIVE:
        return new UE5NativeExporter().export(blueprint);
      case ExportFormat.SQL:
        return new SQLBlueprintExporter().export(blueprint);
      default:
        return new JSONBlueprintExporter().export(blueprint, true);
    }
  }
}

export const blueprintExportManager = new BlueprintExportManager();