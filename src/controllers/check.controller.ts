export interface IBaseCheckDataItem {
  key: string;
}

/**
 * CheckboxController
 * @description 表单复选框状态模型
 */
export class CheckboxController<T extends IBaseCheckDataItem> {
  // 每一项的选中状态
  #checked: Array<boolean> = [];
  // index  key
  #checkMap = new Map<number, T>();
  // 全选状态
  #allChecked = false;

  constructor(
    // Checkbox source
    public source: Array<T>,
    public sourceStatus: Array<boolean>
  ) {
    this.initSource();
  }

  /**
   * 从source & sourceStatus初始化
   */
  initSource() {
    // 将source + sourceStatus 转换为 checkMap 和 checked
    this.source.forEach((s, i) => {
      const currChecked = Boolean(this.sourceStatus[i]);

      if (currChecked) {
        this.#checkMap.set(i, s);
      }
      this.#checked.push(currChecked);
    });

    // 初始化全选状态
    this.setAllChecked();
  }

  /**
   * 重新设置source和sourceStatus
   */
  resetSource(source: Array<T>, sourceStatus: Array<boolean>) {
    this.source = source;
    this.sourceStatus = sourceStatus;
    this.initSource();
  }

  /**
   * 获取check=true的项
   */
  getItemsChecked(): Array<T> {
    const result: Array<T> = [];

    this.#checked.forEach((c, i) => {
      const currItem = this.#checkMap.get(i);
      if (c && currItem) {
        result.push(currItem);
      }
    });

    return result;
  }

  /**
   * 获取完整数组的选中状态
   */
  getAllItemsCheckStatus(): Array<boolean> {
    return [...this.#checked];
  }

  /**
   * 获取checkMap 浅拷贝 共享value
   */
  getCheckMap(): Map<number, T> {
    return new Map(this.#checkMap);
  }

  /**
   * 获取全选状态
   */
  getAllChecked(): boolean {
    return this.#allChecked;
  }

  /**
   * set 全选状态
   */
  private setAllChecked(): void {
    this.#allChecked = this.#checkMap.size === this.source.length;
  }

  /**
   * 检查某一项是否选中
   */
  isChecked(index: number): boolean {
    return this.#checked[index];
  }

  /**
   * 全选事件触发
   */
  allCheckedChange(): void {
    if (this.#allChecked) {
      // 取消全选
      this.#checkMap.clear();
      this.#checked.fill(false);
    } else {
      // 全选
      this.#checkMap.clear();
      this.#checked.fill(true);
      this.source.forEach((s, i) => {
        this.#checkMap.set(i, s);
      });
    }

    this.setAllChecked();
  }

  /**
   * 单个选项切换状态事件触发
   */
  itemCheckedChange(index: number): void {
    const currChecked = this.#checked[index];

    if (currChecked) {
      // 取消选中
      this.#checkMap.delete(index);
    } else {
      // 选中
      this.#checkMap.set(index, this.source[index]);
    }

    this.#checked[index] = !currChecked;

    this.setAllChecked();
  }
}
