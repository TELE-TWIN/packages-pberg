# $Id$

include $(TOPDIR)/rules.mk

PKG_NAME:=libwebsockets
PKG_VERSION:=0.5
PKG_RELEASE:=2
PKG_REV:=f2e5e985c3b51b8c50b8a7c9ee3fbd321c194c35

PKG_SOURCE:=$(PKG_NAME).tar.bz2
PKG_SOURCE_URL:=http://git.warmcat.com/cgi-bin/cgit/libwebsockets

PKG_SOURCE_PROTO:=git
PKG_SOURCE_SUBDIR:=$(PKG_NAME)
PKG_SOURCE_VERSION:=$(PKG_REV)


PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)
PKG_INSTALL:=1

include $(INCLUDE_DIR)/package.mk

define Package/libwebsockets
  SECTION:=libs
  CATEGORY:=Libraries
  TITLE:=libwebsockets
  DEPENDS:= +zlib
endef

define Package/libwebsockets/description
 libwebsockets
endef

define Build/Configure
	$(call Build/Configure/Default,--enable-nofork)
endef

define Build/Compile
	$(MAKE) -C $(PKG_BUILD_DIR)
endef

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/bin $(2)/bin $(1)/usr/include $(1)/usr/lib \
		$(1)/usr/lib/pkgconfig

	$(INSTALL_DATA) \
		$(PKG_INSTALL_DIR)/usr/include/* \
		$(1)/usr/include/

	$(CP) \
		$(PKG_INSTALL_DIR)/usr/lib/libwebsockets.{la,a,so*} \
		$(1)/usr/lib/
endef


define Package/libwebsockets/install
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_BUILD_DIR)/ipkg-install/usr/lib/libwebsockets.so* $(1)/usr/lib/
endef

$(eval $(call BuildPackage,libwebsockets))

