type taskField = 'id' | 'title' | 'description' | 'duration' | 'created_at' | 'updated_at'
type operatorField = '=' | '<' | '>' | '<=' | '>=' | 'IN'
type order = 'ASC' | 'DESC'

export class TaskFilter {
  field: taskField
  operator: operatorField
  value: string | Array<string>

  //TODO - Something about invalid filter query
  constructor(field: taskField, operator: operatorField, value: string | Array<string>) {
    if ((operator == 'IN') == Array.isArray(value)) {
    }

    this.field = field
    this.operator = operator
    this.value = value
  }

  filterString(): string {
    let stringValue = ''
    if (Array.isArray(this.value)) {
      stringValue = '(' + this.value.join(', ') + ')'
    } else {
      stringValue = this.value
    }
    return [this.field, this.operator, `'${stringValue}'`].join(' ')
  }
}

export class TaskOrdering {
  field: taskField
  order: order

  constructor(field: taskField, order: order) {
    this.field = field
    this.order = order
  }

  orderString(): string {
    return [this.field, this.order].join(' ')
  }
}
