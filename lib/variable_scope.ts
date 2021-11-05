import * as ts from 'typescript';

export class Scope {
    public identifiers: string[] = [];
    public identifierRefs: Record<string, ts.Identifier[]> = {};
    public children: Scope[] = [];

    constructor(public parentScope: Scope | null = null) {
        if (this.parentScope) {
            this.parentScope.children.push(this);
        }
    }

    inScope(identifier: string): Scope {
        let scope: Scope | null = this;
        while (scope.parentScope) {
            if (scope.isLocal(identifier)) {
                return scope;
            }
            scope = scope.parentScope;
        }
        return scope;
    }

    add(identifier: string): void {
        this.identifiers.push(identifier);
    }

    isLocal(identifier: string): boolean {
        return this.identifiers.indexOf(identifier) >= 0;
    }

    addReference(identifier: string, node: ts.Identifier): void {
        const scope = this.inScope(identifier);
        if (scope.inScope(identifier)) {
            scope.identifierRefs[identifier] = scope.identifierRefs[identifier] || [];
            scope.identifierRefs[identifier].push(node);
        } else {
            scope.declare(identifier, node);
        }
    }

    declare(identifier: string, node: ts.Identifier): void {
        this.add(identifier);
        this.identifierRefs[identifier] = this.identifierRefs[identifier] || [];
        this.identifierRefs[identifier].push(node);
    }
}

