import { cloneDeep } from "lodash-es";

/**
 * @description 根据父元素宽度和列配置，计算出每列的宽度
 * @return 返回计算后的列配置（cloneDeep）
 */
export class WidthCalculator<C extends { width?: number | string }> {
  private parentWidth: string;
  private column: Array<C>;

  constructor(column: Array<C>, parentWidth: string) {
    this.column = cloneDeep(column);
    this.parentWidth = parentWidth;
  }

  calc() {
    return this.calcColumnWidth(this.column, this.parentWidth);
  }

  /**
   * 计算某宽度在父元素宽度中占比，更改传入值的width属性
   */
  calcColumnWidth(column: Array<C>, parentWidth: string) {
    switch (this.isNumberOrPercentOrPx(parentWidth)) {
      case "number":
        this.calcColumnWidthByPx(column, parentWidth);
        break;
      case "percent":
        this.calcColumnWidthByPercent(column);
        break;
      case "px":
        this.calcColumnWidthByPx(column, parentWidth);
        break;
      default:
        throw new Error("parentWidth is invalid:" + parentWidth);
    }

    return column;
  }

  /**
   * 正则匹配判断当前width是数字、百分比还是px
   */
  isNumberOrPercentOrPx(width: string) {
    if (/^[0-9.]+$/.test(width)) {
      return "number";
    } else if (/^[0-9.]+%$/.test(width)) {
      return "percent";
    } else if (/^[0-9.]+px$/.test(width)) {
      return "px";
    } else {
      return "unknown";
    }
  }

  /**
   * 计算百分比宽度
   * @description 如果表格宽度是百分比，那么列宽度也必须是百分比，其他属性均无效
   * @param column 列配置
   */
  calcColumnWidthByPercent(column: Array<C>) {
    let noWidthColCount = 0;
    let widthSumPercent = 0;

    column.map((c) => {
      if (c.width === undefined) {
        noWidthColCount++;
      } else {
        switch (this.isNumberOrPercentOrPx(c.width.toString())) {
          case "number":
            noWidthColCount++;
            break;
          case "percent":
            widthSumPercent += parseFloat(c.width.toString());
            break;
          case "px":
            noWidthColCount++;
            break;
          default:
            console.warn("c.width is invalid:" + c.width);
            noWidthColCount++;
        }
      }
    });

    // 算出剩余的百分比
    const restPercent = 100 - widthSumPercent;
    // a为缩放比例
    let a = 1;
    // b为px宽度列的宽度
    let b = 0;
    // 如果小于0，说明百分比超过100%
    if (restPercent < 0) {
      // 如果还有未设置宽度的列或者设置了px宽度的列，将之前设置的百分比宽度等比缩放后，让其总和减少到90%
      if (noWidthColCount > 0) {
        a = (restPercent - 10) / widthSumPercent + 1;
        b = 10 / noWidthColCount;
      } else {
        a = restPercent / widthSumPercent + 1;
      }
    } else {
      // 如果大于0，说明百分比没有达到100%
      if (noWidthColCount > 0) {
        b = restPercent / noWidthColCount;
      } else {
        a = restPercent / widthSumPercent + 1;
      }
    }

    const bStr = b + "%";

    // 给每个列设置宽度
    column.map((c) => {
      if (c.width === undefined) {
        // 赋值成x%
        c.width = bStr;
      } else {
        switch (this.isNumberOrPercentOrPx(c.width.toString())) {
          case "number":
            c.width = bStr;
            break;
          case "percent":
            c.width = parseFloat(c.width.toString()) * a + "%";
            break;
          case "px":
            c.width = bStr;
            break;
          default:
            c.width = bStr;
        }
      }
    });
  }

  /**
   * 计算数字宽度
   * @param column 列配置
   * @param parentWidth 父元素宽度
   */
  calcColumnWidthByPx(column: Array<C>, parentWidth: string) {
    let noWidthColCount = 0;
    let widthSumPx = 0;

    column.map((c) => {
      if (c.width === undefined) {
        noWidthColCount++;
      } else {
        switch (this.isNumberOrPercentOrPx(c.width.toString())) {
          // 看做px
          case "number":
            widthSumPx += parseFloat(c.width.toString());
            break;
          // 转化成px
          case "percent":
            widthSumPx +=
              (parseFloat(c.width.toString()) * parseFloat(parentWidth)) / 100;
            break;
          case "px":
            widthSumPx += parseFloat(c.width.toString());
            break;
          default:
            console.warn("c.width is invalid:" + c.width);
            noWidthColCount++;
        }
      }
    });

    // 算出剩余的px
    const restPx = parseFloat(parentWidth) - widthSumPx;
    // a为缩放比例
    let a = 1;
    // b为px宽度列的宽度
    let b = 0;
    // 如果小于0，说明px超过父元素宽度
    if (restPx < 0) {
      // 如果还有未设置宽度的列或者设置了px宽度的列，将之前设置的px宽度等比缩放后，让其总和减少到父元素宽度
      if (noWidthColCount > 0) {
        a = (restPx - 100) / widthSumPx + 1;
        b = 100 / noWidthColCount;
      } else {
        a = restPx / widthSumPx + 1;
      }
    } else {
      // 如果大于0，说明px没有达到父元素宽度
      if (noWidthColCount > 0) {
        b = restPx / noWidthColCount;
      } else {
        a = restPx / widthSumPx + 1;
      }
    }

    const bStr = b + "px";

    // 给每个列设置宽度
    column.map((c) => {
      if (c.width === undefined) {
        // 赋值成xpx
        c.width = bStr;
      } else {
        switch (this.isNumberOrPercentOrPx(c.width.toString())) {
          case "number":
            c.width = parseFloat(c.width.toString()) * a + "px";
            break;
          case "percent":
            c.width =
              (parseFloat(c.width.toString()) / 100) *
                parseFloat(parentWidth) *
                a +
              "px";
            break;
          case "px":
            c.width = parseFloat(c.width.toString()) * a + "px";
            break;
          default:
            c.width = bStr;
        }
      }
    });
  }
}
