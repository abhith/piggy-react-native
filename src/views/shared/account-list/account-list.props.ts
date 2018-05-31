import { ViewStyle, TouchableOpacityProperties } from "react-native"
import { AccountListPresetNames } from "./account-list.presets"
import { AccountSnapshot } from "../../../models/account/account";

export interface AccountListProps extends TouchableOpacityProperties {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle

  /**
   * One of the different types of text presets.
   */
  preset?: AccountListPresetNames

  title: string
  accounts: AccountSnapshot []
  isLoading: boolean
  onRefresh: any
}